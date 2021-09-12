import { Resource, AccessRule } from "../config/AppSettings";
export declare type InitializationOptions = {
    saveCacheToDisk?: boolean;
    useSession?: boolean;
    customState?: Object;
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
export declare type TokenRequestOptions = {
    resource: Resource;
    claims?: string;
    skipCache?: boolean;
};
export declare type GuardOptions = {
    accessRule: AccessRule;
};
