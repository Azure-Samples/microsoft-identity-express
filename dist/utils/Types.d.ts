import { AccountInfo, AuthorizationUrlRequest, AuthorizationCodeRequest } from "@azure/msal-node";
import { TokenClaims } from "@azure/msal-common";
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
export declare type IdTokenClaims = TokenClaims & {
    aud?: string;
    roles?: string[];
    groups?: string[];
    _claim_names?: string[];
    _claim_sources?: string[];
    xms_cc?: string;
    acrs?: string[];
};
export declare type AccessTokenClaims = TokenClaims & {
    scp?: string;
    aud?: string;
    roles?: string[];
    groups?: string[];
    _claim_names?: string[];
    _claim_sources?: string[];
    xms_cc?: string;
    acrs?: string[];
};
