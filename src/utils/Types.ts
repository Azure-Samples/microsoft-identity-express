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
        nonce: string;
        isAuthenticated: boolean;
        hasAccess: boolean;
        account: AccountInfo;
        authCodeRequest: AuthorizationUrlRequest;
        tokenRequest: AuthorizationCodeRequest;
        remoteResources?: {
            [resource: string]: Resource;
        };
        ownedResources?: {
            [resource: string]: Resource;
        },
    }
};

// extending express request
declare module "express" {
    export interface Request {
        authInfo?: object,
        oboToken?: string;
    }
};

export type User = {
    account: AccountInfo;
    isAuthenticated: boolean;
    hasAccess: boolean;
};

export type AuthCodeParams = {
    authority: string;
    scopes: string[];
    state: string;
    redirect: string;
    prompt?: string;
    account?: AccountInfo;
};