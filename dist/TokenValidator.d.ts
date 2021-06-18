import { TokenClaims } from "@azure/msal-common";
import { Configuration } from "@azure/msal-node";
import { AppSettings } from "./Types";
export declare class TokenValidator {
    appSettings: AppSettings;
    msalConfig: Configuration;
    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration);
    /**
     *
     * @param {string} authToken
     * @returns {Promise}
     */
    verifyTokenSignature(authToken: string): Promise<TokenClaims | boolean>;
    /**
     *
     * @param {string} idToken: raw Id token
     * @returns {Promise}
     */
    validateIdToken(idToken: string): Promise<boolean>;
    /**
     * Validates the id token for a set of claims
     * @param {TokenClaims} idTokenClaims: decoded id token claims
     * @returns {boolean}
     */
    validateIdTokenClaims(idTokenClaims: TokenClaims): boolean;
    /**
     * Validates the access token for signature and against a predefined set of claims
     * @param {string} accessToken: raw JWT token
     * @param {string} protectedRoute: used for checking scope
     * @returns {Promise}
     */
    validateAccessToken(accessToken: string, protectedRoute: string): Promise<boolean>;
    /**
     * Validates the access token for a set of claims
     * @param {TokenClaims} verifiedToken: token with a verified signature
     * @param {string} protectedRoute: route where this token is required to access
     * @returns {boolean}
     */
    validateAccessTokenClaims(verifiedToken: TokenClaims, protectedRoute: string): boolean;
    /**
     * Fetches signing keys of an access token
     * from the authority discovery endpoint
     * @param {Object} header: token header
     * @param {string} tid: tenant id
     * @returns {Promise}
     */
    private getSigningKeys;
}
