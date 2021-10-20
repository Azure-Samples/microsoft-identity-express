/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

import {
    StringUtils,
    Constants,
    TokenClaims,
    Logger
} from "@azure/msal-common";
import { Configuration } from "@azure/msal-node";

import {
    AuthToken,
    TokenHeader,
    IdTokenClaims,
    AccessTokenClaims
} from "./AuthToken";

import { AppSettings } from "../config/AppSettings";
import { ConfigHelper } from "../config/ConfigHelper";

import {
    ErrorMessages,
    AADAuthorityConstants
} from "../utils/Constants";

export class TokenValidator {

    logger: Logger;
    private appSettings: AppSettings;
    private msalConfig: Configuration;

    /**
     * @param {AppSettings} appSettings 
     * @param {Configuration} msalConfig
     * @param {Logger} logger
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration, logger: Logger) {
        this.appSettings = appSettings;
        this.msalConfig = msalConfig;
        this.logger = logger;
    }

    /**
     * Verifies the access token for signature and claims
     * @param {string} idToken: raw Id token
     * @returns {Promise}
     */
    async validateIdToken(idToken: string): Promise<boolean> {
        try {
            const verifiedToken = await this.verifyTokenSignature(idToken);

            if (verifiedToken) {
                return this.validateIdTokenClaims(verifiedToken as IdTokenClaims);
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    /**
     * Verifies the access token for signature and claims
     * @param {string} accessToken: raw access token
     * @param {string} protectedRoute: used for checking scope
     * @returns {Promise}
     */
    async validateAccessToken(accessToken: string, protectedRoute: string): Promise<boolean> {
        try {
            const verifiedToken = await this.verifyTokenSignature(accessToken);

            if (verifiedToken) {
                return this.validateAccessTokenClaims(verifiedToken as AccessTokenClaims, protectedRoute);
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    /**
     * Verifies a given token's signature using jwks-rsa
     * @param {string} authToken 
     * @returns {Promise}
     */
    private async verifyTokenSignature(authToken: string): Promise<TokenClaims | boolean> {
        if (StringUtils.isEmpty(authToken)) {
            this.logger.error(ErrorMessages.TOKEN_NOT_FOUND);
            return false;
        }

        // we will first decode to get kid parameter in header
        let decodedToken: AuthToken = TokenValidator.decodeAuthToken(authToken);

        // obtains signing keys from discovery endpoint
        let keys;

        try {
            keys = await this.getSigningKeys(decodedToken.header, decodedToken.payload.tid);
        } catch (error) {
            this.logger.error(ErrorMessages.KEYS_NOT_OBTAINED);
            return false;
        }

        // verify the signature at header section using keys
        let verifiedToken: TokenClaims;

        try {
            verifiedToken = jwt.verify(authToken, keys);

            /**
             * if a multiplexer was used in place of tenantId i.e. if the app
             * is multi-tenant, the tenantId should be obtained from the user"s
             * token"s tid claim for verification purposes
             */
            if (
                this.appSettings.appCredentials.tenantId === AADAuthorityConstants.COMMON ||
                this.appSettings.appCredentials.tenantId === AADAuthorityConstants.ORGANIZATIONS ||
                this.appSettings.appCredentials.tenantId === AADAuthorityConstants.CONSUMERS
            ) {
                this.appSettings.appCredentials.tenantId = decodedToken.payload.tid;
            }

            return verifiedToken;
        } catch (error) {
            this.logger.error(ErrorMessages.TOKEN_NOT_VERIFIED);
            return false;
        }
    };

    /**
     * Fetches signing keys of an access token
     * from the authority discovery endpoint
     * @param {TokenHeader} header: token header
     * @param {string} tid: tenant id
     * @returns {Promise}
     */
    private async getSigningKeys(header: TokenHeader, tid: string): Promise<string> {
        let jwksUri;

        // Check if a B2C application i.e. app has b2cPolicies
        if (this.appSettings.b2cPolicies) {
            jwksUri = `${this.msalConfig.auth.authority}/discovery/v2.0/keys`;
        } else {
            jwksUri = `https://${Constants.DEFAULT_AUTHORITY_HOST}/${tid}/discovery/v2.0/keys`;
        }

        const client = jwksClient({
            jwksUri: jwksUri,
        });

        return (await client.getSigningKeyAsync(header.kid)).getPublicKey();
    };

    /**
     * Validates the id token for a set of claims
     * @param {IdTokenClaims} idTokenClaims: decoded id token claims
     * @returns {boolean}
     */
    private validateIdTokenClaims(idTokenClaims: IdTokenClaims): boolean {
        const now = Math.round(new Date().getTime() / 1000); // in UNIX format

        /**
         * At the very least, check for issuer, audience, issue and expiry dates.
         * For more information on validating id tokens, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/id-tokens#validating-an-id_token
         */
        const checkIssuer = idTokenClaims.iss.includes(this.appSettings.appCredentials.tenantId) ? true : false;
        const checkAudience = idTokenClaims.aud === this.msalConfig.auth.clientId ? true : false;
        const checkTimestamp = idTokenClaims.iat <= now && idTokenClaims.exp >= now ? true : false;

        return checkIssuer && checkAudience && checkTimestamp;
    };

    /**
     * Validates the access token for a set of claims
     * @param {TokenClaims} verifiedToken: token with a verified signature
     * @param {string} protectedRoute: route where this token is required to access
     * @returns {boolean}
     */
    private validateAccessTokenClaims(verifiedToken: AccessTokenClaims, protectedRoute: string): boolean {
        const now = Math.round(new Date().getTime() / 1000); // in UNIX format

        /**
         * At the very least, validate the token with respect to issuer, audience, scope
         * and timestamp, though implementation and extent vary. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens
         */
        const checkIssuer = verifiedToken.iss.includes(this.appSettings.appCredentials.tenantId) ? true : false;
        const checkTimestamp = verifiedToken.iat <= now && verifiedToken.iat >= now ? true : false;

        const checkAudience = verifiedToken.aud === this.appSettings.appCredentials.clientId ||
            verifiedToken.aud === "api://" + this.appSettings.appCredentials.clientId ? true : false;

        const checkScopes = ConfigHelper.getScopesFromResourceEndpoint(protectedRoute, this.appSettings)
            .every(scp => verifiedToken.scp.includes(scp));

        return checkAudience && checkIssuer && checkTimestamp && checkScopes;
    };

    static decodeAuthToken(authToken: string): AuthToken {

        try {
            return jwt.decode(authToken, { complete: true });
        } catch (error) {
            throw new Error(ErrorMessages.TOKEN_NOT_DECODED);
        }
    }
}
