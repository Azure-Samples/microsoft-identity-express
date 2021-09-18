import {
    RequestHandler
} from "express";

import {
    InitializationOptions,
    SignInOptions,
    SignOutOptions,
    HandleRedirectOptions,
    TokenRequestOptions,
    GuardOptions,
} from "./MiddlewareOptions";

export interface IAuthMiddleware {
    initialize(options?: InitializationOptions): RequestHandler;
    signIn(options?: SignInOptions): RequestHandler;
    signOut(options?: SignOutOptions): RequestHandler;
    handleRedirect(options?: HandleRedirectOptions): RequestHandler;
    getToken(options?: TokenRequestOptions): RequestHandler;
    isAuthenticated(options?: GuardOptions): RequestHandler;
    hasAccess(options?: GuardOptions): RequestHandler;
    getTokenOnBehalf(options?: TokenRequestOptions): RequestHandler;
    isAuthorized(options?: GuardOptions): RequestHandler;
}
