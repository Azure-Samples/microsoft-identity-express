/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TokenClaims } from "@azure/msal-common";

import {
    AccountInfo,
    AuthorizationUrlRequest,
    AuthorizationCodeRequest,
} from "@azure/msal-node";

// extending express Request object
declare module "express-session" {
    interface SessionData {
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

export type State = {
    nonce: string;
    stage: string;
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
    extraScopesToConsent?: string[];
    failureRedirect?: string;
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

export type ValidationOptions = {
    audience: string;
    issuer: string;
    scope: string;
};

// ======= CONFIG ========

export type AppSettings = {
    appCredentials: AppCredentials;
    authRoutes?: AuthRoutes;
    b2cPolicies?: {
        [policy: string]: Policy;
    };
    remoteResources?: {
        [resource: string]: Resource;
    };
    ownedResources?: {
        [resource: string]: Resource
    },
    accessMatrix?: {
        [accessRule: string]: AccessRule
    }
};

export type AppCredentials = {
    instance?: string;
    clientId: string;
    tenantId: string;
    clientSecret?: string;
    clientCertificate?: ClientCertificate;
    keyVaultCredential?: KeyVaultCredential;
};

export type ClientCertificate = {
    thumbprint: string;
    privateKey: string;
    x5c?: string
};

export type KeyVaultCredential = {
    credentialType: string;
    credentialName: string;
    keyVaultUrl: string;
};

export type AuthRoutes = {
    redirect: string;
    error: string;
    unauthorized: string;
    frontChannelLogout?: string;
};

export type Policy = {
    authority: string;
};

export type Resource = {
    endpoint: string;
    scopes: string[];
    accessToken?: string;
};

export type AccessRule = {
    path: string;
    methods: string[];
    roles?: string[];
    groups?: string[];
};

// ======= USER ========

export type UserInfo = {
    businessPhones?: Array<string>;
    displayName?: string;
    givenName?: string;
    id?: string;
    jobTitle?: string;
    mail?: string;
    mobilePhone?: string;
    officeLocation?: string;
    preferredLanguage?: string;
    surname?: string;
    userPrincipalName?: string;
};

/**
 * Type which describes Id Token claims known by MSAL.
 */
export type IdTokenClaims = TokenClaims & {
    aud?: string,
    roles?: string[],
    groups?: string[],
    _claim_names?: string[],
    _claim_sources?: string[],
    xms_cc?: string,
    acrs?: string[],
};

/**
 * Type which describes Access Token claims known by MSAL.
 */
export type AccessTokenClaims = TokenClaims & {
    scp?: string[],
    aud?: string,
    roles?: string[],
    groups?: string[],
    _claim_names?: string[],
    _claim_sources?: string[],
    xms_cc?: string,
    acrs?: string[],
};