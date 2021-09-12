/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LoggerOptions } from "@azure/msal-common";

export type AppSettings = {
    appCredentials: AppCredentials;
    authRoutes?: AuthRoutes;
    loggerOptions?: LoggerOptions;
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
    tenantInfo: string;
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