/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { StringUtils, Constants, TokenClaims } from "@azure/msal-common";
import { Configuration } from "@azure/msal-node";

import { AppSettings, Resource } from "./Types";
import { ErrorMessages, AADAuthorityConstants } from "./Constants";

export class TokenValidator {
    appSettings: AppSettings;
    msalConfig: Configuration;

    /**
     * @param {AppSettings} appSettings 
     * @param {Configuration} msalConfig
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration) {
        this.appSettings = appSettings;
        this.msalConfig = msalConfig;
    }

    /**
     * 
     * @param {string} authToken 
     * @returns {Promise}
     */
    async verifyTokenSignature(authToken: string): Promise<TokenClaims | boolean> {
        if (StringUtils.isEmpty(authToken)) {
            console.log(ErrorMessages.TOKEN_NOT_FOUND);
            return false;
        }

        // we will first decode to get kid parameter in header
        let decodedToken;

        try {
            decodedToken = jwt.decode(authToken, { complete: true });
        } catch (error) {
            console.log(ErrorMessages.TOKEN_NOT_DECODED);
            console.log(error);
            return false;
        }

        // obtains signing keys from discovery endpoint
        let keys;

        try {
            keys = await this.getSigningKeys(decodedToken.header, decodedToken.payload.tid);
        } catch (error) {
            console.log(ErrorMessages.KEYS_NOT_OBTAINED);
            console.log(error);
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
            console.log(ErrorMessages.TOKEN_NOT_VERIFIED);
            console.log(error);
            return false;
        }
    };

    /**
     *
     * @param {string} idToken: raw Id token
     * @returns {Promise}
     */
     async validateIdToken(idToken: string): Promise<boolean> {
        try {
            const verifiedToken = await this.verifyTokenSignature(idToken);

            if (verifiedToken) {
                return this.validateIdTokenClaims(verifiedToken as TokenClaims);
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    /**
     * Validates the id token for a set of claims
     * @param {TokenClaims} idTokenClaims: decoded id token claims
     * @returns {boolean}
     */
    validateIdTokenClaims(idTokenClaims: TokenClaims): boolean {
        const now = Math.round(new Date().getTime() / 1000); // in UNIX format

        /**
         * At the very least, check for issuer, audience, issue and expiry dates.
         * For more information on validating id tokens, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/id-tokens#validating-an-id_token
         */
        const checkIssuer = idTokenClaims["iss"].includes(this.appSettings.appCredentials.tenantId) ? true : false;
        const checkAudience = idTokenClaims["aud"] === this.msalConfig.auth.clientId ? true : false;
        const checkTimestamp = idTokenClaims["iat"] <= now && idTokenClaims["exp"] >= now ? true : false;

        return checkIssuer && checkAudience && checkTimestamp;
    };

    /**
     * Validates the access token for signature and against a predefined set of claims
     * @param {string} accessToken: raw JWT token
     * @param {string} protectedRoute: used for checking scope
     * @returns {Promise}
     */
     async validateAccessToken(accessToken: string, protectedRoute: string): Promise<boolean> {
        try {
            const verifiedToken = await this.verifyTokenSignature(accessToken);

            if (verifiedToken) {
                return this.validateAccessTokenClaims(verifiedToken as TokenClaims, protectedRoute);
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    /**
     * Validates the access token for a set of claims
     * @param {TokenClaims} verifiedToken: token with a verified signature
     * @param {string} protectedRoute: route where this token is required to access
     * @returns {boolean}
     */
    validateAccessTokenClaims(verifiedToken: TokenClaims, protectedRoute: string): boolean {
        const now = Math.round(new Date().getTime() / 1000); // in UNIX format

        /**
         * At the very least, validate the token with respect to issuer, audience, scope
         * and timestamp, though implementation and extent vary. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens
         */
        const checkIssuer = verifiedToken["iss"].includes(this.appSettings.appCredentials.tenantId) ? true : false;
        const checkTimestamp = verifiedToken["iat"] <= now && verifiedToken["exp"] >= now ? true : false;

        const checkAudience = verifiedToken["aud"] === this.appSettings.appCredentials.clientId ||
            verifiedToken["aud"] === "api://" + this.appSettings.appCredentials.clientId ? true : false;

        const checkScopes = Object.values(this.appSettings.ownedResources).find((resource: Resource) => resource.endpoint === protectedRoute)
            .scopes.every(scp => verifiedToken["scp"].includes(scp));

        return checkAudience && checkIssuer && checkTimestamp && checkScopes;
    };

    /**
     * Fetches signing keys of an access token
     * from the authority discovery endpoint
     * @param {Object} header: token header
     * @param {string} tid: tenant id
     * @returns {Promise}
     */
    private async getSigningKeys(header, tid: string): Promise<string> {
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
}
