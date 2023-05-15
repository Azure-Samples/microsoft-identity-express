import { NodeAuthOptions, NodeSystemOptions } from "@azure/msal-node";
export declare type AppSettings = {
    authOptions: AuthOptions;
    systemOptions?: NodeSystemOptions;
};
export declare type WebAppSettings = AppSettings & {
    authRoutes: AuthRoutes;
};
export declare type AuthOptions = NodeAuthOptions & {
    instance?: string;
    tenantId: string;
};
export declare type AuthRoutes = {
    redirectUri: string;
    frontChannelLogoutUri?: string;
    postLogoutRedirectUri?: string;
};
export declare type ProtectedResourcesMap = Record<string, ProtectedResourceParams>;
export declare type ProtectedResourceParams = {
    scopes: Array<string>;
    routes: Array<string>;
    methods?: Array<string>;
};
export declare enum AppType {
    WebApp = 0
}
