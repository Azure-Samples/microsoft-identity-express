/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TokenClaims } from "@azure/msal-common";

export type AuthToken = {
    header: TokenHeader,
    payload: TokenClaims,
    signature: string,
}

export type TokenHeader = {
    kid: string;
    alg: string;
    typ: string;
    x5t?: string;
}

export type IdTokenClaims = TokenClaims & {
    aud?: string,
    roles?: string[],
    groups?: string[],
    _claim_names?: string[],
    _claim_sources?: string[],
    xms_cc?: string,
    acrs?: string[],
};

export type AccessTokenClaims = TokenClaims & {
    scp?: string,
    aud?: string,
    roles?: string[],
    groups?: string[],
    _claim_names?: string[],
    _claim_sources?: string[],
    xms_cc?: string,
    acrs?: string[],
};