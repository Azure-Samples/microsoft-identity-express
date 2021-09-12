import { AccountInfo, AuthorizationUrlRequest, AuthorizationCodeRequest } from "@azure/msal-node";
import { Resource, AccessRule } from "../config/AppSettings";
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
    failureRedirect?: string;
    extraScopesToConsent?: string[];
};
export declare type SignOutOptions = {
    successRedirect: string;
    failureRedirect?: string;
};
export declare type HandleRedirectOptions = {};
export declare type GuardOptions = {
    accessRule: AccessRule;
};
