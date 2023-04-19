/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { RouteGuardOptions } from "./MiddlewareOptions";
import { Request, Response, NextFunction, RequestHandler } from "./MiddlewareTypes";

function guardMiddleware(
    this: WebAppAuthProvider,
    options: RouteGuardOptions
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void | Response => {
        if (!req.authContext.isAuthenticated()) {
            if (options && options.forceLogin) {
                // TODO: should you check for appSettings protectedResources?
                return req.authContext.signIn({
                    scopes: [],
                    postLoginRedirectUri: req.originalUrl
                })(req, res, next);
            }

            return res.status(401).send("Unauthorized");
        }

        if (options && options.idTokenClaims) {
            // TODO: no need to rely on session for account
            const tokenClaims = Object.values(req.session.account?.idTokenClaims || {});
            const requiredClaims = Object.values(options.idTokenClaims) as string[];

            if (!requiredClaims.every((claim) => tokenClaims.includes(claim))) {
                return res.status(403).send("Forbidden");
            }
        }

        next();
    };
}

export default guardMiddleware;
