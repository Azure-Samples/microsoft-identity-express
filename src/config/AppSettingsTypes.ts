/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { NodeAuthOptions, NodeSystemOptions } from "@azure/msal-node";

export type AppSettings = {
    authOptions: AuthOptions;
    systemOptions?: NodeSystemOptions;
};

export type WebAppSettings = AppSettings & {
    authRoutes: AuthRoutes;
};

export type AuthOptions = NodeAuthOptions & {
    instance?: string;
    tenantId: string;
};

export type AuthRoutes = {
    redirectUri: string;
    frontChannelLogoutUri?: string;
    postLogoutRedirectUri?: string;
};

export type ProtectedResourcesMap = Record<string, ProtectedResourceParams>;

export type ProtectedResourceParams = {
    scopes: Array<string>,
    routes: Array<string>,
    methods?: Array<string>,
};

export enum AppType {
    WebApp
}
