/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LoggerOptions, SystemOptions } from "@azure/msal-common";

export type AppSettings = {
    appCredentials: AppCredentials;
    loggerOptions?: LoggerOptions;
    systemOptions?: SystemOptions;
};

export type WebAppSettings = AppSettings & {
    authRoutes: AuthRoutes;
    protectedResources?: ProtectedResourcesMap
};

export type AppCredentials = {
    instance?: string;
    clientId: string;
    tenantId: string;
    clientSecret?: string;
    clientCertificate?: ClientCertificate;
};

export type ClientCertificate = {
    thumbprint: string;
    privateKey: string;
    x5c?: string;
};

export type AuthRoutes = {
    redirectUri: string;
    frontChannelLogoutUri?: string;
};

export type ProtectedResourcesMap = Record<string, ProtectedResourceParams>;

export type ProtectedResourceParams = {
    scopes: Array<string>,
    routes?: Array<string>,
    methods?: Array<string>,
};

export enum AppType {
    WebApp
}
