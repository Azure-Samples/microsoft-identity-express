import { AccountInfo, AuthorizationUrlRequest, AuthorizationCodeRequest } from "@azure/msal-node";
declare module "express-session" {
    interface SessionData {
        authCodeRequest: AuthorizationUrlRequest;
        tokenRequest: AuthorizationCodeRequest;
        account: AccountInfo;
        nonce: string;
        isAuthenticated?: boolean;
        resources: {
            [resource: string]: Resource;
        };
        services: {
            [service: string]: Service;
        };
    }
}
export declare type AuthCodeParams = {
    authority: string;
    scopes: string[];
    state: string;
    redirect: string;
    prompt?: string;
    account?: AccountInfo;
};
export declare type InitializationOptions = {};
export declare type MiddlewareOptions = {};
export declare type ValidationOptions = {
    audience: string;
    issuer: string;
    scope: string;
};
export declare type State = {
    nonce: string;
    stage: string;
};
export declare type AppSettings = {
    credentials: Credentials;
    settings: Settings;
    policies?: {
        [policy: string]: Policy;
    };
    resources?: {
        [resource: string]: Resource;
    };
    services?: {
        [service: string]: Service;
    };
    accessMatrix?: {
        [accessRule: string]: AccessRule;
    };
};
export declare type Credentials = {
    clientId: string;
    tenantId: string;
    clientSecret?: string;
    clientCertificate?: ClientCertificate;
};
export declare type ClientCertificate = {
    thumbprint: string;
    privateKey: string;
};
export declare type Settings = {
    homePageRoute: string;
    redirectUri: string;
    postLogoutRedirectUri: string;
};
export declare type Service = {
    endpoint: string;
    scopes: string[];
};
export declare type Resource = {
    callingPageRoute: string;
    endpoint: string;
    scopes: string[];
    accessToken?: string;
};
export declare type Policy = {
    authority: string;
};
export declare type AccessRule = {
    path: string;
    methods: string[];
    roles: string[];
};
export declare type UserInfo = {
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
