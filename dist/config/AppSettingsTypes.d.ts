import { LoggerOptions, SystemOptions } from "@azure/msal-common";
export declare type AppSettings = {
    appCredentials: AppCredentials;
    loggerOptions?: LoggerOptions;
    systemOptions?: SystemOptions;
};
export declare type WebAppSettings = AppSettings & {
    authRoutes: AuthRoutes;
    protectedResources?: ProtectedResourcesMap;
};
export declare type AppCredentials = {
    instance?: string;
    clientId: string;
    tenantId: string;
    clientSecret?: string;
    clientCertificate?: ClientCertificate;
    cloudDiscoveryMetadata?: string;
    authorityMetadata?: string;
};
export declare type ClientCertificate = {
    thumbprint: string;
    privateKey: string;
    x5c?: string;
};
export declare type AuthRoutes = {
    redirectUri: string;
    frontChannelLogoutUri?: string;
};
export declare type ProtectedResourcesMap = Record<string, ProtectedResourceParams>;
export declare type ProtectedResourceParams = {
    scopes: Array<string>;
    routes?: Array<string>;
    methods?: Array<string>;
};
export declare enum AppType {
    WebApp = 0
}
