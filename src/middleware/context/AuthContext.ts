/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AccountInfo } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { Request, Response, NextFunction, RequestHandler } from "../MiddlewareTypes";
import { SignInOptions, SignOutOptions, TokenRequestOptions } from "../MiddlewareOptions";
import acquireTokenHandler from "../handlers/acquireTokenHandler";
import loginHandler from "../handlers/loginHandler";
import logoutHandler from "../handlers/logoutHandler";

type RequestContext = {
    req: Request, res: Response, next: NextFunction
};

export class AuthContext {
    provider: WebAppAuthProvider;
    context: RequestContext;

    constructor(provider: WebAppAuthProvider, context: RequestContext) {
        this.provider = provider;
        this.context = context;
    }

    /**
     * Initiates sign in flow
     * @param {SignInOptions} options: options to modify login request
     * @returns {RequestHandler}
     */
    signIn(
        options: SignInOptions = {
            postLoginRedirectUri: "/",
            postFailureRedirectUri: "/",
            scopes: [],
        }
    ): RequestHandler {
        // TODO: consider passing context IIFE
        return loginHandler.call(this.provider, options);
    }

    /**
     * Initiate sign out and destroy the session
     * @param {SignOutOptions} options: options to modify logout request
     * @returns {RequestHandler}
     */
    signOut(
        options: SignOutOptions = {
            postLogoutRedirectUri: "/",
            idpLogout: true
        }
    ): RequestHandler {
        return logoutHandler.call(this.provider, options);
    }

    /**
     * Middleware that gets tokens via acquireToken*
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getToken(options: TokenRequestOptions = {
        scopes: [],
    }): RequestHandler {
        return acquireTokenHandler.call(this.provider, options);
    }

    getAccount(): AccountInfo {
        return { ...this.context.req.session.account };
    }

    isAuthenticated(): boolean {
        // TODO: check if account or session
        return this.context.req.session.isAuthenticated;
    }

    getCachedTokenForResource(resource: string): string | null {
        // TODO: should keep an internal map of tokens and check that
        return resource;
    }
}
