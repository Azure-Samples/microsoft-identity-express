import { LoggerOptions } from "@azure/msal-common";
export declare type AppSettings = {
    appCredentials: AppCredentials;
    authRoutes?: AuthRoutes;
    loggerOptions?: LoggerOptions;
    b2cPolicies?: {
        [policy: string]: Policy;
    };
    accessMatrix?: {
        [accessRule: string]: AccessRule;
    };
    protectedResources?: {
        [resource: string]: Resource;
    };
    ownedResources?: {
        [resource: string]: Resource;
    };
};
export declare type AppCredentials = {
    instance?: string;
    clientId: string;
    tenantId: string;
    clientSecret?: string;
    clientCertificate?: ClientCertificate;
};
export declare type ClientCertificate = {
    thumbprint: string;
    privateKey: string;
    x5c?: string;
};
export declare type KeyVaultCredential = {
    credentialType: string;
    credentialName: string;
    keyVaultUrl: string;
};
export declare type AuthRoutes = {
    redirect: string;
    error: string;
    unauthorized: string;
    frontChannelLogout?: string;
};
export declare type Policy = {
    authority: string;
};
export declare type Resource = {
    endpoint: string;
    scopes: string[];
    accessToken?: string;
};
export declare type AccessRule = {
    path: string;
    methods: string[];
    roles?: string[];
    groups?: string[];
};
