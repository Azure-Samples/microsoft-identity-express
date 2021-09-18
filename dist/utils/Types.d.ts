import { AccountInfo, AuthorizationUrlRequest, AuthorizationCodeRequest } from "@azure/msal-node";
import { Resource } from "../config/AppSettings";
declare module "express-session" {
    interface SessionData {
        id: string;
        nonce: string;
        isAuthenticated: boolean;
        hasAccess: boolean;
        account: AccountInfo;
        authCodeRequest: AuthorizationUrlRequest;
        tokenRequest: AuthorizationCodeRequest;
        remoteResources?: {
            [resource: string]: Resource;
        };
        ownedResources?: {
            [resource: string]: Resource;
        };
    }
}
declare module "express" {
    interface Request {
        authInfo?: object;
        oboToken?: string;
    }
}
export declare type User = {
    account: AccountInfo;
    isAuthenticated: boolean;
    hasAccess: boolean;
};
export declare type AuthCodeParams = {
    authority: string;
    scopes: string[];
    state: string;
    redirect: string;
    prompt?: string;
    account?: AccountInfo;
};
