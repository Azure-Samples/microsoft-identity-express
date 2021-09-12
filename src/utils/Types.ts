/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    AccountInfo,
    AuthorizationUrlRequest,
    AuthorizationCodeRequest,
} from "@azure/msal-node";

import { 
    Resource,
    AccessRule
} from "../config/AppSettings";

// extending express Request object
declare module "express-session" {
    interface SessionData {
        id: string;
        authCodeRequest: AuthorizationUrlRequest;
        tokenRequest: AuthorizationCodeRequest;
        account: AccountInfo;
        nonce: string;
        isAuthenticated?: boolean;
        remoteResources?: {
            [resource: string]: Resource;
        };
        ownedResources?: {
            [resource: string]: Resource;
        },
    }
}

export type AuthCodeParams = {
    authority: string;
    scopes: string[];
    state: string;
    redirect: string;
    prompt?: string;
    account?: AccountInfo;
};

export type InitializationOptions = {
    saveCacheToDisk?: boolean;
    useSession?: boolean;
    customState?: Object;
};

export type TokenRequestOptions = {
    resource: Resource;
    claims?: string;
    skipCache?: boolean;
};

export type SignInOptions = {
    successRedirect: string;
    failureRedirect?: string;
    extraScopesToConsent?: string[];
}

export type SignOutOptions = {
    successRedirect: string;
    failureRedirect?: string;
}

export type HandleRedirectOptions = {
    // TODO: add options
};

export type GuardOptions = {
    accessRule: AccessRule
};