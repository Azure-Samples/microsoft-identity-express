import { TokenClaims } from "@azure/msal-common";
import { AccountInfo, AuthorizationUrlRequest, AuthorizationCodeRequest } from "@azure/msal-node";
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
export declare type State = {
    nonce: string;
    stage: string;
};
export declare type InitializationOptions = {
    saveCacheToDisk?: boolean;
    useSession?: boolean;
    customState?: Object;
};
export declare type TokenRequestOptions = {
    resource: Resource;
    claims?: string;
    skipCache?: boolean;
};
export declare type SignInOptions = {
    successRedirect: string;
    extraScopesToConsent?: string[];
    failureRedirect?: string;
};
export declare type SignOutOptions = {
    successRedirect: string;
    failureRedirect?: string;
};
export declare type HandleRedirectOptions = {};
export declare type GuardOptions = {
    accessRule: AccessRule;
};
export declare type ValidationOptions = {
    audience: string;
    issuer: string;
    scope: string;
};
export declare type AppSettings = {
    appCredentials: AppCredentials;
    authRoutes?: AuthRoutes;
    b2cPolicies?: {
        [policy: string]: Policy;
    };
    remoteResources?: {
        [resource: string]: Resource;
    };
    ownedResources?: {
        [resource: string]: Resource;
    };
    accessMatrix?: {
        [accessRule: string]: AccessRule;
    };
};
export declare type AppCredentials = {
    instance?: string;
    clientId: string;
    tenantId: string;
    clientSecret?: string;
    clientCertificate?: ClientCertificate;
    keyVaultCredential?: KeyVaultCredential;
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
/**
 * Type which describes Id Token claims known by MSAL.
 */
export declare type IdTokenClaims = TokenClaims & {
    aud?: string;
    roles?: string[];
    groups?: string[];
    _claim_names?: string[];
    _claim_sources?: string[];
    xms_cc?: string;
    acrs?: string[];
};
/**
 * Type which describes Access Token claims known by MSAL.
 */
export declare type AccessTokenClaims = TokenClaims & {
    scp?: string[];
    aud?: string;
    roles?: string[];
    groups?: string[];
    _claim_names?: string[];
    _claim_sources?: string[];
    xms_cc?: string;
    acrs?: string[];
};
