/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
export declare const AppStages: {
    SIGN_IN: string;
    SIGN_OUT: string;
    ACQUIRE_TOKEN: string;
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
 * Constants used in access control scenarios
 */
export declare const AccessConstants: {
    GROUPS: string;
    ROLES: string;
    CLAIM_NAMES: string;
    CLAIM_SOURCES: string;
    PAGINATION_LINK: string;
    GRAPH_MEMBERS_ENDPOINT: string;
    GRAPH_MEMBER_SCOPES: string;
};
/**
 * String constants related to AAD Authority
 */
export declare const AADAuthorityConstants: {
    COMMON: string;
    ORGANIZATIONS: string;
    CONSUMERS: string;
};
/**
 * String constants related to AAD Authority
 */
export declare const KeyVaultCredentialTypes: {
    SECRET: string;
    CERTIFICATE: string;
};
/**
 * For more information, visit: https://login.microsoftonline.com/error
 */
export declare const ErrorCodes: {
    65001: string;
};
