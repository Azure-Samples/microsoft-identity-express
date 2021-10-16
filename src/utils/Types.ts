/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    AccountInfo,
    AuthorizationUrlRequest,
    AuthorizationCodeRequest,
} from "@azure/msal-node";

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