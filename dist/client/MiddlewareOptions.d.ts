import { Resource, AccessRule } from '../config/AppSettings';
export declare type SignInOptions = {
    postLoginRedirect: string;
    failureRedirect: string;
    extraScopesToConsent?: string[];
    customState?: Object;
};
export declare type SignOutOptions = {
    postLogoutRedirect: string;
};
export declare type TokenRequestOptions = {
    resource: Resource;
    claims?: string;
    skipCache?: boolean;
    customState?: Object;
};
export declare type GuardOptions = {
    accessRule: AccessRule;
};
