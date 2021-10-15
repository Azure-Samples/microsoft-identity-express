/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    LoggerOptions,
    LogLevel,
    OIDC_DEFAULT_SCOPES,
} from "@azure/msal-common";

/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
export enum AppStages {
    SIGN_IN = "sign_in",
    SIGN_OUT = "sign_out",
    ACQUIRE_TOKEN = "acquire_token",
};

/**
 * String constants related to AAD Authority
 */
export const AADAuthorityConstants = {
    COMMON: "common",
    ORGANIZATIONS: "organizations",
    CONSUMERS: "consumers"
}

/**
 * String constants related credential type
 */
export enum KeyVaultCredentialTypes {
    SECRET = "clientSecret",
    CERTIFICATE = "clientCertificate",
}

export const OIDC_SCOPES = [
    ...OIDC_DEFAULT_SCOPES,
    "email"
]

/**
 * Request headers used by App Service authentication
 */
export const AppServiceAuthenticationHeaders = {
    APP_SERVICE_AUTHENTICATION_HEADER: "X-MSAL-APP-SERVICE-AUTHENTICATION",
    APP_SERVICE_ACCESS_TOKEN_HEADER: "X-MS-TOKEN-AAD-ACCESS-TOKEN",
    APP_SERVICE_ID_TOKEN_HEADER: "X-MS-TOKEN-AAD-ID-TOKEN",
    APP_SERVICE_REFRESH_TOKEN_HEADER: "X-MS-TOKEN-AAD-REFRESH-TOKEN",
    APP_SERVICE_ACCESS_TOKEN_EXPIRES_HEADER: "X-MS-TOKEN-AAD-EXPIRES-ON",
    APP_SERVICE_USER_OID_HEADER: "X-MS-CLIENT-PRINCIPAL-ID",
    APP_SERVICE_USER_UPN_HEADER: "X-MS-CLIENT-PRINCIPAL-NAME",
    APP_SERVICE_IDP_X_HEADER: "X-MS-CLIENT-PRINCIPAL-IDP"
}

/**
 * Endpoints used by App Service authentication
 */
export const AppServiceAuthenticationEndpoints = {
    ID_TOKEN_ENDPOINT: "/.auth/me",
    POST_LOGOUT_DEFAULT_ENDPOINT: "/.auth/logout/done",
    POST_LOGIN_DEFAULT_ENDPOINT: "/.auth/login/done",
    AAD_SIGN_IN_ENDPOINT: "/.auth/login/aad",
    AAD_SIGN_OUT_ENDPOINT: "/.auth/logout",
    TOKEN_REFRESH_ENDPOINT: "/.auth/refresh",
    AAD_REDIRECT_ENDPOINT: "/.auth/login/aad/callback",
}

/**
 * Query parameters used by App Service authentication endpoints
 */
export const AppServiceAuthenticationQueryParameters = {
    POST_LOGIN_REDIRECT_QUERY_PARAM: "?post_login_redirect_url=",
    POST_LOGOUT_REDIRECT_QUERY_PARAM: "?post_logout_redirect_uri=",
}

/**
 * Environment variables used by App Service authentication
 */
export const AppServiceEnvironmentVariables = {
    WEBSITE_AUTH_ENABLED: "WEBSITE_AUTH_ENABLED",
    WEBSITE_AUTH_ALLOWED_AUDIENCES: "WEBSITE_AUTH_ALLOWED_AUDIENCES",
    WEBSITE_AUTH_DEFAULT_PROVIDER: "WEBSITE_AUTH_DEFAULT_PROVIDER",
    WEBSITE_AUTH_TOKEN_STORE: "WEBSITE_AUTH_TOKEN_STORE",
    WEBSITE_AUTH_LOGIN_PARAMS: "WEBSITE_AUTH_LOGIN_PARAMS",
    WEBSITE_AUTH_PRESERVE_URL_FRAGMENT: "WEBSITE_AUTH_PRESERVE_URL_FRAGMENT",
    WEBSITE_AUTH_OPENID_ISSUER: "WEBSITE_AUTH_OPENID_ISSUER",
    WEBSITE_AUTH_CLIENT_ID: "WEBSITE_AUTH_CLIENT_ID",
    WEBSITE_HOSTNAME: "WEBSITE_HOSTNAME",
    WEBSITE_SITE_NAME: "WEBSITE_SITE_NAME",
    WEBSITE_AUTH_REQUIRE_HTTPS: "WEBSITE_AUTH_REQUIRE_HTTPS",
    WEBSITE_AUTH_UNAUTHENTICATED_ACTION: "WEBSITE_AUTH_UNAUTHENTICATED_ACTION",
    WEBSITE_AUTH_API_PREFIX: "WEBSITE_AUTH_API_PREFIX",
    MICROSOFT_PROVIDER_AUTHENTICATION_SECRET: "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET",
}

/**
 * Constants used in access control scenarios
 */
export const AccessControlConstants = {
    GROUPS: "groups",
    ROLES: "roles",
    CLAIM_NAMES: "_claim_name",
    CLAIM_SOURCES: "_claim_sources",
    PAGINATION_LINK: "@odata.nextLink",
    GRAPH_MEMBERS_ENDPOINT: "https://graph.microsoft.com/v1.0/me/memberOf",
    GRAPH_MEMBER_SCOPES: "User.Read GroupMember.Read.All"
};

/**
 * Various information constants
 */
export const InfoMessages = {
    APP_SERVICE_AUTH_DETECTED: "App Service Authentication detected",
    REQUEST_FOR_RESOURCE: "Request made to web API",
    OVERAGE_OCCURRED: "User has too many groups. Groups overage claim occurred"
}

/**
 * Various error constants
 */
export const ErrorMessages = {
    NOT_PERMITTED: "Not permitted",
    INVALID_TOKEN: "Invalid token",
    CANNOT_DETERMINE_APP_STAGE: "Cannot determine application stage",
    CANNOT_VALIDATE_TOKEN: "Cannot validate token",
    NONCE_MISMATCH: "Nonce does not match",
    INTERACTION_REQUIRED: "interaction_required",
    TOKEN_ACQUISITION_FAILED: "Token acquisition failed",
    AUTH_CODE_NOT_OBTAINED: "Authorization code cannot be obtained",
    TOKEN_NOT_FOUND: "No token found",
    TOKEN_NOT_DECODED: "Token cannot be decoded",
    TOKEN_NOT_VERIFIED: "Token cannot be verified",
    KEYS_NOT_OBTAINED: "Signing keys cannot be obtained",
    STATE_NOT_FOUND: "State not found",
    USER_HAS_NO_ROLE: "User does not have any roles",
    USER_NOT_IN_ROLE: "User does not have this role",
    USER_HAS_NO_GROUP: "User does not have any groups",
    USER_NOT_IN_GROUP: "User does not have this group",
    METHOD_NOT_ALLOWED: "Method not allowed for this route",
    RULE_NOT_FOUND: "No rule found for this route",
    SESSION_NOT_FOUND: "No session found for this request",
    KEY_VAULT_CONFIG_NOT_FOUND: "No coordinates found for Key Vault"
};

/**
 * Various configuration error constants
 */
export const ConfigurationErrorMessages = {
    NO_CLIENT_ID: "No clientId provided!",
    INVALID_CLIENT_ID: "Invalid clientId!",
    NO_TENANT_INFO: "No tenant info provided!",
    INVALID_TENANT_INFO: "Invalid tenant info!",
    NO_CLIENT_CREDENTIAL: "No client credential provided!",
    NO_REDIRECT_URI: "No redirect URI provided!",
    NO_ERROR_ROUTE: "No error route provided!",
    NO_UNAUTHORIZED_ROUTE: "No unauthorized route provided!"
}

/**
 * For more information, visit: https://login.microsoftonline.com/error
 */
export const ErrorCodes = {
    65001: "AADSTS65001", // consent required
    50076: "AADSTS50076", // mfa required
    50079: "AADSTS50079", // mfa enrollment required
    50001: "AADSTS50001", // invalid resource uri
    65004: "AADSTS65004", // user declined consent
    70011: "AADSTS70011", // invalid scope
    700022: "AADSTS700022", // multiple resources
    700020: "AADSTS700020", // interaction required
    90118: "AADB2C90118", // password forgotten (B2C)
};

export const DEFAULT_LOGGER_OPTIONS: LoggerOptions = {
    loggerCallback: (logLevel, message, containsPii) => {
        if (containsPii) {
            return;
        }
        console.info(message);
    },
    piiLoggingEnabled: false,
    logLevel: LogLevel.Info,
};