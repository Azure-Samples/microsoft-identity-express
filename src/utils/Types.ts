/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    AccountInfo,
    AuthorizationUrlRequest,
    AuthorizationCodeRequest,
} from "@azure/msal-node";

import { TokenClaims } from "@azure/msal-common";

import { Resource } from "../config/AppSettings";

// extending express session
declare module "express-session" {
    interface SessionData {
        id: string;
        key: string;
        nonce: string;
        isAuthenticated: boolean;
        hasAccess: boolean;
        account: AccountInfo;
        authCodeRequest: AuthorizationUrlRequest;
        tokenRequest: AuthorizationCodeRequest;
        protectedResources?: {
            [resource: string]: Resource;
        };
    }
};

// extending express request
declare module "express" {
    export interface Request {
        authInfo?: object;
        oboToken?: string;
        oboAssertion?: string;
    }
};

// prepare auth code and token requests
export type AuthCodeParams = {
    authority: string;
    scopes: string[];
    state: string;
    redirect: string;
    prompt?: string;
    account?: AccountInfo;
};


// prepare IdToken payload
export type IdTokenClaims = TokenClaims & {
    aud?: string,
    roles?: string[],
    groups?: string[],
    _claim_names?: string[],
    _claim_sources?: string[],
    xms_cc?: string,
    acrs?: string[],
};

// prepare AccessToken payload
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