/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { AuthenticateMiddlewareOptions } from "./MiddlewareOptions";
import { Request, Response, NextFunction, RequestHandler } from "./MiddlewareTypes";
import { UrlUtils } from "../utils/UrlUtils";
import { ErrorMessages, HttpMethods } from "../utils/Constants";
import { AuthContext } from "./context/AuthContext";
import redirectHandler from "./handlers/redirectHandler";
import { ProtectedResourceParams } from "../config/AppSettingsTypes";
import acquireTokenHandler from "./handlers/acquireTokenHandler";

/**
 * Authenticates incoming requests using the WebAppAuthProvider
 * @param {WebAppAuthProvider} this 
 * @param {AuthenticateMiddlewareOptions} options 
 * @returns {RequestHandler}
 */
function authenticateMiddleware(this: WebAppAuthProvider, options: AuthenticateMiddlewareOptions): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void | RequestHandler => {
        this.getLogger().trace("Authenticating request");

        if (options.useSession && !req.session) {
            throw new Error(ErrorMessages.SESSION_NOT_FOUND);
        }

        req.authContext = new AuthContext(this, { req, res, next });

        if (req.method === HttpMethods.POST) {
            if (UrlUtils.ensureAbsoluteUrlFromRequest(req) === UrlUtils.ensureAbsoluteUrlFromRequest(req, this.webAppSettings.authRoutes.redirectUri)) {
                this.getLogger().trace("Handling redirect");
                return redirectHandler.call(this)(req, res, next);
            }
        }

        if (this.webAppSettings.authRoutes.frontChannelLogoutUri) {
            if (req.method === HttpMethods.GET) {
                if (UrlUtils.ensureAbsoluteUrlFromRequest(req) === UrlUtils.ensureAbsoluteUrlFromRequest(req, this.webAppSettings.authRoutes.frontChannelLogoutUri)) {
                    this.getLogger().trace("frontChannelLogoutUri called");

                    if (req.session.isAuthenticated) {
                        return req.authContext.logout({
                            postLogoutRedirectUri: "/",
                            idpLogout: false
                        })(req, res, next);
                    }

                    return res.status(401).send("Unauthorized");
                }
            }
        }

        if (options.protectAllRoutes) {
            if (!req.authContext.isAuthenticated()) {
                return req.authContext.login({
                    scopes: [],
                    postLoginRedirectUri: req.originalUrl
                })(req, res, next);
            }
        }

        if (options.acquireTokenForResources) {
            // acquire token for routes calling protected resources
            Object.entries(options.acquireTokenForResources).forEach((params: [string, ProtectedResourceParams]) => {
                const [resourceName, resourceParams] = params;

                if (req.authContext.getCachedTokenForResource(resourceName)) {
                    this.getLogger().trace("Cached token found for resource endpoint");
                    return;
                }

                if (resourceParams.routes.includes(req.originalUrl)) {
                    if ((resourceParams.methods?.length && resourceParams.methods.includes(req.method)) || req.method === HttpMethods.GET) {
                        this.getLogger().trace("Acquiring token for resource endpoint");
                        return acquireTokenHandler.call(this, { scopes: resourceParams.scopes }, true)(req, res, next);
                    }
                }
            });
        }

        next();
    };
}

export default authenticateMiddleware;
