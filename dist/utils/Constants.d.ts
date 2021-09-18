import { LoggerOptions } from "@azure/msal-common";
/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
export declare enum AppStages {
    SIGN_IN = "sign_in",
    SIGN_OUT = "sign_out",
    ACQUIRE_TOKEN = "acquire_token"
}
/**
 * String constants related to AAD Authority
 */
export declare const AADAuthorityConstants: {
    COMMON: string;
    ORGANIZATIONS: string;
    CONSUMERS: string;
};
/**
 * String constants related credential type
 */
export declare enum KeyVaultCredentialTypes {
    SECRET = "clientSecret",
    CERTIFICATE = "clientCertificate"
}
/**
 * Request headers used by App Service authentication
 */
export declare const AppServiceAuthenticationHeaders: {
    APP_SERVICE_AUTHENTICATION_HEADER: string;
    APP_SERVICE_ACCESS_TOKEN_HEADER: string;
    APP_SERVICE_ID_TOKEN_HEADER: string;
    APP_SERVICE_REFRESH_TOKEN_HEADER: string;
    APP_SERVICE_ACCESS_TOKEN_EXPIRES_HEADER: string;
    APP_SERVICE_USER_OID_HEADER: string;
    APP_SERVICE_USER_UPN_HEADER: string;
    APP_SERVICE_IDP_X_HEADER: string;
};
/**
 * Endpoints used by App Service authentication
 */
export declare const AppServiceAuthenticationEndpoints: {
    ID_TOKEN_ENDPOINT: string;
    POST_LOGOUT_DEFAULT_ENDPOINT: string;
    POST_LOGIN_DEFAULT_ENDPOINT: string;
    AAD_SIGN_IN_ENDPOINT: string;
    AAD_SIGN_OUT_ENDPOINT: string;
    TOKEN_REFRESH_ENDPOINT: string;
    AAD_REDIRECT_ENDPOINT: string;
};
/**
 * Query parameters used by App Service authentication endpoints
 */
export declare const AppServiceAuthenticationQueryParameters: {
    POST_LOGIN_REDIRECT_QUERY_PARAM: string;
    POST_LOGOUT_REDIRECT_QUERY_PARAM: string;
};
/**
 * Constants used in access control scenarios
 */
export declare const AccessControlConstants: {
    GROUPS: string;
    ROLES: string;
    CLAIM_NAMES: string;
    CLAIM_SOURCES: string;
    PAGINATION_LINK: string;
    GRAPH_MEMBERS_ENDPOINT: string;
    GRAPH_MEMBER_SCOPES: string;
};
/**
 * Various information constants
 */
export declare const InfoMessages: {
    REQUEST_FOR_RESOURCE: string;
    OVERAGE_OCCURRED: string;
};
/**
 * Various error constants
 */
export declare const ErrorMessages: {
    NOT_PERMITTED: string;
    INVALID_TOKEN: string;
    CANNOT_DETERMINE_APP_STAGE: string;
    CANNOT_VALIDATE_TOKEN: string;
    NONCE_MISMATCH: string;
    INTERACTION_REQUIRED: string;
    TOKEN_ACQUISITION_FAILED: string;
    AUTH_CODE_NOT_OBTAINED: string;
    TOKEN_NOT_FOUND: string;
    TOKEN_NOT_DECODED: string;
    TOKEN_NOT_VERIFIED: string;
    KEYS_NOT_OBTAINED: string;
    STATE_NOT_FOUND: string;
    USER_HAS_NO_ROLE: string;
    USER_NOT_IN_ROLE: string;
    USER_HAS_NO_GROUP: string;
    USER_NOT_IN_GROUP: string;
    METHOD_NOT_ALLOWED: string;
    RULE_NOT_FOUND: string;
    SESSION_NOT_FOUND: string;
    KEY_VAULT_CONFIG_NOT_FOUND: string;
};
/**
 * Various configuration error constants
 */
export declare const ConfigurationErrorMessages: {
    NO_CLIENT_ID: string;
    INVALID_CLIENT_ID: string;
    NO_TENANT_INFO: string;
    INVALID_TENANT_INFO: string;
    NO_CLIENT_CREDENTIAL: string;
    NO_REDIRECT_URI: string;
    NO_ERROR_ROUTE: string;
    NO_UNAUTHORIZED_ROUTE: string;
};
/**
 * For more information, visit: https://login.microsoftonline.com/error
 */
export declare const ErrorCodes: {
    65001: string;
};
export declare const DEFAULT_LOGGER_OPTIONS: LoggerOptions;
