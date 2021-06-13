/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
export const AppStages = {
    SIGN_IN: "sign_in",
    SIGN_OUT: "sign_out",
    ACQUIRE_TOKEN: "acquire_token",
};

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
    SESSION_NOT_FOUND: "No session found for this request"
};

/**
 * Constants used in access control scenarios
 */
 export const AccessConstants = {
    GROUPS: "groups",
    ROLES: "roles",
    CLAIM_NAMES: "_claim_name",
    CLAIM_SOURCES: "_claim_sources"
};

/**
 * For more information, visit: https://login.microsoftonline.com/error
 */
export const ErrorCodes = {
    65001: "AADSTS65001", // consent required
};