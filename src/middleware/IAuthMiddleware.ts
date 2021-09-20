/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

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
    getTokenOnBehalf(options?: TokenRequestOptions): RequestHandler;
    isAuthenticated(options?: GuardOptions): RequestHandler;
    isAuthorized(options?: GuardOptions): RequestHandler;
    hasAccess(options?: GuardOptions): RequestHandler;
}
