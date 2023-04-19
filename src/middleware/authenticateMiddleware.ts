/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { AuthenticateMiddlewareOptions } from "./MiddlewareOptions";
import { Request, Response, NextFunction, RequestHandler } from "./MiddlewareTypes";
import { UrlUtils } from "../utils/UrlUtils";
import { ErrorMessages } from "../utils/Constants";
import { AuthContext } from "./context/AuthContext";

import redirectHandler from "./handlers/redirectHandler";

/**
 * Initialize AuthProvider and set default routes and handlers
 * @returns {RequestHandler}
 */
function authenticateMiddleware(
    this: WebAppAuthProvider,
    options: AuthenticateMiddlewareOptions
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void | RequestHandler => {
        this.getLogger().info("Authenticating request");

        req.authContext = new AuthContext(this, { req, res, next });

        if (options && options.useSession && !req.session) {
            throw new Error(ErrorMessages.SESSION_NOT_FOUND);
        }

        if (req.method === "POST" && UrlUtils.ensureAbsoluteUrl(req.originalUrl, req.protocol, req.get("host") || req.hostname) === UrlUtils.ensureAbsoluteUrl(this.webAppSettings.authRoutes.redirectUri, req.protocol, req.get("host") || req.hostname)) {
            this.getLogger().verbose("Handling redirect");

            if (options.acquireTokenForResources) {
                // TODO: might have to pass this to redirectHandler
            }

            return redirectHandler.call(this)(req, res, next);
        }

        if (this.webAppSettings.authRoutes.frontChannelLogoutUri) {
            if (req.method === "GET" && UrlUtils.ensureAbsoluteUrl(req.originalUrl, req.protocol, req.get("host") || req.hostname) === UrlUtils.getPathFromUrl(this.webAppSettings.authRoutes.frontChannelLogoutUri)) {
                if (req.session.isAuthenticated) {
                    return req.authContext.signOut({
                        postLogoutRedirectUri: "/",
                        idpLogout: false
                    })(req, res, next);
                }

                return res.status(401).send("Unauthorized");
            }
        }

        if (options && options.protectAllRoutes) {
            if (!req.authContext.isAuthenticated()) {
                return req.authContext.signIn({
                    scopes: [],
                    postLoginRedirectUri: req.originalUrl
                })(req, res, next);
            }
        }

        if (options && options.acquireTokenForResources) {  
            // TODO: call acquireToken for these
        }

        next();
    };
}

export default authenticateMiddleware;
