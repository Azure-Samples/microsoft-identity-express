import { TokenClaims } from "@azure/msal-common";
import { Configuration } from "@azure/msal-node";
import { AppSettings, IdTokenClaims, AccessTokenClaims } from "./Types";
export declare class TokenValidator {
    private appSettings;
    private msalConfig;
    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration);
    /**
     * Verifies a given token's signature using jwks-rsa
     * @param {string} authToken
     * @returns {Promise}
     */
    verifyTokenSignature(authToken: string): Promise<TokenClaims | boolean>;
    /**
     * Verifies the access token for signature
     * @param {string} idToken: raw Id token
     * @returns {Promise}
     */
    validateIdToken(idToken: string): Promise<boolean>;
    /**
     * Validates the id token for a set of claims
     * @param {IdTokenClaims} idTokenClaims: decoded id token claims
     * @returns {boolean}
     */
    validateIdTokenClaims(idTokenClaims: IdTokenClaims): boolean;
    /**
     * Verifies the access token for signature
     * @param {string} accessToken: raw JWT token
     * @param {string} protectedRoute: used for checking scope
     * @returns {Promise}
     */
    verifyAccessTokenSignature(accessToken: string, protectedRoute: string): Promise<boolean>;
    /**
     * Validates the access token for a set of claims
     * @param {TokenClaims} verifiedToken: token with a verified signature
     * @param {string} protectedRoute: route where this token is required to access
     * @returns {boolean}
     */
    validateAccessTokenClaims(verifiedToken: AccessTokenClaims, protectedRoute: string): boolean;
    /**
     * Fetches signing keys of an access token
     * from the authority discovery endpoint
     * @param {Object} header: token header
     * @param {string} tid: tenant id
     * @returns {Promise}
     */
    private getSigningKeys;
}
