import { Resource, AccessRule } from '../config/AppSettings';
export declare type SignInOptions = {
    postLoginRedirect: string;
    failureRedirect: string;
};
export declare type SignOutOptions = {
    postLogoutRedirect: string;
};
export declare type TokenRequestOptions = {
    resource: Resource;
};
export declare type GuardOptions = {
    accessRule: AccessRule;
};
