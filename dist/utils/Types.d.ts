import { AccountInfo, AuthorizationUrlRequest, AuthorizationCodeRequest } from "@azure/msal-node";
import { Resource } from "../config/AppSettings";
declare module "express-session" {
    interface SessionData {
        id: string;
        key: string;
        nonce: string;
        isAuthenticated: boolean;
        hasAccess: boolean;
        account: AccountInfo;
        authCodeRequest: AuthorizationUrlRequest;
        tokenRequest: AuthorizationCodeRequest;
        protectedResources?: {
            [resource: string]: Resource;
        };
    }
}
declare module "express" {
    interface Request {
        authInfo?: object;
        oboToken?: string;
        oboAssertion?: string;
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
