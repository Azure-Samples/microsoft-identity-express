/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { Request, Response, NextFunction, ErrorRequestHandler } from "./MiddlewareTypes";
import { InteractionRequiredError } from "../error/InteractionRequiredError";

function errorMiddleware(this: WebAppAuthProvider): ErrorRequestHandler {
    return (err: unknown, req: Request, res: Response, next: NextFunction): Response | void => {
        if (err instanceof InteractionRequiredError) {
            return req.authContext.login({
                scopes: err.scopes || [],
                claims: err.claims || undefined,
                postLoginRedirectUri: req.originalUrl
            })(req, res, next);
        }

        next(err);
    };
}

export default errorMiddleware;
