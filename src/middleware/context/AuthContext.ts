/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TimeUtils } from "@azure/msal-common";
import { AccountInfo } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { RequestContext, RequestHandler } from "../MiddlewareTypes";
import { LoginOptions, LogoutOptions, TokenRequestOptions } from "../MiddlewareOptions";
import loginHandler from "../handlers/loginHandler";
import logoutHandler from "../handlers/logoutHandler";
import acquireTokenHandler from "../handlers/acquireTokenHandler";
export class AuthContext {
    private provider: WebAppAuthProvider;
    private context: RequestContext;

    constructor(provider: WebAppAuthProvider, context: RequestContext) {
        this.provider = provider;
        this.context = context;
    }

    /**
     * Initiates login flow
     * @param {LoginOptions} options: options to modify login request
     * @returns {RequestHandler}
     */
    login(
        options: LoginOptions = {
            postLoginRedirectUri: "/",
            postFailureRedirectUri: "/",
            scopes: [],
        }
    ): RequestHandler {
        return loginHandler.call(this.provider, options);
    }

    /**
     * Initiates logout flow and destroys the current session
     * @param {LogoutOptions} options: options to modify logout request
     * @returns {RequestHandler}
     */
    logout(
        options: LogoutOptions = {
            postLogoutRedirectUri: "/",
            idpLogout: true
        }
    ): RequestHandler {
        return logoutHandler.call(this.provider, options);
    }

    /**
     * Acquires an access token for given scopes
     * @param {TokenRequestOptions} options: options to modify token request
     * @returns {RequestHandler}
     */
    acquireToken(options: TokenRequestOptions = {
        scopes: [],
    }): RequestHandler {
        return acquireTokenHandler.call(this.provider, options);
    }

    /**
     * Returns the account object from the session
     * @returns {AccountInfo} account object
     */
    getAccount(): AccountInfo {
        return this.context.req.session.account;
    }

    /**
     * Returns true if the account object is not null
     * @returns {boolean} authentication status
     */
    isAuthenticated(): boolean {
        return !!this.getAccount();
    }

    /**
     * Returns the cached token for a given resource
     * @param {string} resourceName: name of resource to retrieve token for 
     * @returns {string | null} cached access token
     */
    getCachedTokenForResource(resourceName: string): string | null {
        if (this.context.req.session.protectedResources && this.context.req.session.protectedResources[resourceName]) {
            
            const expiresOn = new Date(
                this.context.req.session.protectedResources[resourceName].expiresOn as unknown as string
            );
            
            if (!expiresOn) {
                return null; // would this ever happen?
            }

            const isTokenExpired = TimeUtils.isTokenExpired(
                Math.floor(expiresOn.getTime() / 1000).toString(),
                300 // offset in seconds TODO: should get from config
            );

            if (!isTokenExpired) {
                return this.context.req.session.protectedResources[resourceName].accessToken;
            }
        }

        return null;
    }
}
