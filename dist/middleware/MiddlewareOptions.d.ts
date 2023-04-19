import { CommonEndSessionRequest, TokenClaims } from "@azure/msal-common";
import { AuthorizationUrlRequest, AuthorizationCodeRequest, AccountInfo } from "@azure/msal-node";
export declare type AuthenticateMiddlewareOptions = {
    protectAllRoutes?: boolean;
    useSession?: boolean;
};
export declare type SignInOptions = Pick<AuthorizationCodeRequest, "scopes" | "claims" | "tokenBodyParameters" | "tokenQueryParameters"> & Pick<AuthorizationUrlRequest, "scopes" | "account" | "loginHint" | "domainHint" | "state" | "extraQueryParameters" | "extraScopesToConsent" | "prompt" | "sid"> & {
    postLoginRedirectUri?: string;
    postFailureRedirectUri?: string;
};
export declare type SignOutOptions = Pick<CommonEndSessionRequest, "account" | "state" | "postLogoutRedirectUri" | "logoutHint" | "extraQueryParameters"> & {
    postLogoutRedirectUri?: string;
    idpLogout?: boolean;
    clearCache?: boolean;
};
export declare type TokenRequestOptions = Pick<AuthorizationCodeRequest, "scopes" | "claims" | "tokenBodyParameters" | "tokenQueryParameters"> & Pick<AuthorizationUrlRequest, "scopes" | "account" | "loginHint" | "domainHint" | "state" | "extraQueryParameters" | "extraScopesToConsent" | "prompt" | "sid"> & {
    account?: AccountInfo;
    postLoginRedirectUri?: string;
    postFailureRedirectUri?: string;
};
export declare type RouteGuardOptions = {
    forceLogin?: boolean;
    postLoginRedirectUri?: string;
    postFailureRedirectUri?: string;
    idTokenClaims?: IdTokenClaims;
};
export declare type AppState = {
    redirectTo: string;
    customState?: string;
};
export declare type IdTokenClaims = TokenClaims & {
    aud?: string;
    roles?: string[];
    groups?: string[];
    _claim_names?: string[];
    _claim_sources?: string[];
    xms_cc?: string;
    acrs?: string[];
    [key: string]: string | number | string[] | object | undefined | unknown;
};
