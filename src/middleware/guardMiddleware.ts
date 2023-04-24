/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { RouteGuardOptions } from "./MiddlewareOptions";
import { Request, Response, NextFunction, RequestHandler } from "./MiddlewareTypes";

function guardMiddleware(this: WebAppAuthProvider, options: RouteGuardOptions): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void | Response => {
        if (!req.authContext.isAuthenticated()) {
            if (options && options.forceLogin) {
                // TODO: should you check for appSettings protectedResources?
                return req.authContext.signIn({
                    scopes: [],
                    postLoginRedirectUri: req.originalUrl,
                })(req, res, next);
            }

            return res.status(401).send("Unauthorized");
        }

        if (options && options.idTokenClaims) {
            // TODO: no need to rely on session for account
            const tokenClaims = req.session.account?.idTokenClaims || {};
            const requiredClaims = options.idTokenClaims;
            const hasClaims = Object.keys(requiredClaims).every((claim: string) => {
                if (requiredClaims[claim] && tokenClaims[claim]) {
                    switch (typeof requiredClaims[claim]) {
                        case "string" || "number":
                            return requiredClaims[claim] === tokenClaims[claim];
                        case "object":
                            if (Array.isArray(requiredClaims[claim])) {
                                const requiredClaimsArray = requiredClaims[claim] as [];
                                const tokenClaimsArray = tokenClaims[claim] as [];
                                return requiredClaimsArray.some(
                                    (requiredClaim) => tokenClaimsArray.indexOf(requiredClaim) >= 0
                                );
                            }
                            break;
                        default:
                            break;
                    }
                }
                return false;
            });
            if (!hasClaims) {
                return res.status(403).send("Forbidden");
            }
        }

        next();
    };
}

export default guardMiddleware;
