import { Logger } from "@azure/msal-common";
import { Configuration } from "@azure/msal-node";
import { AuthToken } from "./AuthToken";
import { AppSettings } from "../config/AppSettings";
export declare class TokenValidator {
    logger: Logger;
    private appSettings;
    private msalConfig;
    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @param {Logger} logger
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration, logger: Logger);
    /**
     * Verifies the access token for signature and claims
     * @param {string} idToken: raw Id token
     * @returns {Promise}
     */
    validateIdToken(idToken: string): Promise<boolean>;
    /**
     * Verifies the access token for signature and claims
     * @param {string} accessToken: raw access token
     * @param {string} protectedRoute: used for checking scope
     * @returns {Promise}
     */
    validateAccessToken(accessToken: string, protectedRoute: string): Promise<boolean>;
    /**
     * Verifies a given token's signature using jwks-rsa
     * @param {string} authToken
     * @returns {Promise}
     */
    private verifyTokenSignature;
    /**
     * Fetches signing keys of an access token
     * from the authority discovery endpoint
     * @param {TokenHeader} header: token header
     * @param {string} tid: tenant id
     * @returns {Promise}
     */
    private getSigningKeys;
    /**
     * Validates the id token for a set of claims
     * @param {IdTokenClaims} idTokenClaims: decoded id token claims
     * @returns {boolean}
     */
    private validateIdTokenClaims;
    /**
     * Validates the access token for a set of claims
     * @param {TokenClaims} verifiedToken: token with a verified signature
     * @param {string} protectedRoute: route where this token is required to access
     * @returns {boolean}
     */
    private validateAccessTokenClaims;
    static decodeAuthToken(authToken: string): AuthToken;
}
