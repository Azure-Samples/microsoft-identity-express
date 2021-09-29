import { Resource, AccessRule } from "../config/AppSettings";
export declare type InitializationOptions = {};
export declare type SignInOptions = {
    successRedirect: string;
    failureRedirect?: string;
    extraScopesToConsent?: string[];
    customState?: Object;
};
export declare type SignOutOptions = {
    successRedirect: string;
    failureRedirect?: string;
};
export declare type HandleRedirectOptions = {};
export declare type TokenRequestOptions = {
    resource: Resource;
    claims?: string;
    skipCache?: boolean;
    customState?: Object;
};
export declare type GuardOptions = {
    accessRule?: AccessRule;
};
