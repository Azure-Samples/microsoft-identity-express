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
import acquireTokenHandler from "./handlers/acquireTokenHandler";

function authenticateMiddleware(
    this: WebAppAuthProvider,
    options: AuthenticateMiddlewareOptions
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void | RequestHandler => {
        this.getLogger().trace("authenticateMiddleware called");

        if (!req.session) {
            throw new Error(ErrorMessages.SESSION_NOT_FOUND);
        }

        if (!req.authContext) {
            req.authContext = new AuthContext(this, { req, res, next });
        }

        if (req.method === HttpMethods.POST) {
            if (UrlUtils.ensureAbsoluteUrlFromRequest(req) === UrlUtils.ensureAbsoluteUrlFromRequest(req, this.webAppSettings.authRoutes.redirectUri)) {
                this.getLogger().verbose("Handling redirect response");
                return redirectHandler.call(this)(req, res, next);
            }
        }

        if (this.webAppSettings.authRoutes.frontChannelLogoutUri) {
            if (req.method === HttpMethods.GET) {
                if (UrlUtils.ensureAbsoluteUrlFromRequest(req) === UrlUtils.ensureAbsoluteUrlFromRequest(req, this.webAppSettings.authRoutes.frontChannelLogoutUri)) {
                    this.getLogger().trace("frontChannelLogoutUri called");

                    if (req.authContext.isAuthenticated()) {
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
                    postLoginRedirectUri: req.originalUrl,
                    scopes: [],
                })(req, res, next);
            }
        }

        if (options.acquireTokenForResources) {
            const resources = Object.entries(options.acquireTokenForResources);

            for (const resource of resources) {
                const [resourceName, resourceParams] = resource;

                if (req.authContext.getCachedTokenForResource(resourceName)) {
                    this.getLogger().verbose("Cached token found for resource endpoint");
                    return next();
                }

                if (resourceParams.routes.includes(req.originalUrl)) {
                    if ((resourceParams.methods?.length && resourceParams.methods.includes(req.method)) || req.method === HttpMethods.GET) {
                        this.getLogger().verbose("Acquiring token for resource: ", resourceName);
                        return acquireTokenHandler.call(this, { scopes: resourceParams.scopes }, { resourceName })(req, res, next);
                    }
                }
            }
        }

        next();
    };
}

export default authenticateMiddleware;
