/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AuthenticationResult, InteractionRequiredAuthError, SilentFlowRequest } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { Request, Response, NextFunction, RequestHandler } from "../MiddlewareTypes";
import { TokenRequestOptions } from "../MiddlewareOptions";
import { InteractionRequiredError } from "../../error/InteractionRequiredError";

function acquireTokenHandler(
    this: WebAppAuthProvider,
    options: TokenRequestOptions
): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<AuthenticationResult | void> => {
        this.getLogger().verbose("acquireTokenHandler called");

        const account = options.account || req.session.account;

        if (!account) {
            throw new InteractionRequiredError("no_account_found", "No account found either in options or in session", undefined, options.scopes);
        }

        const silentRequest: SilentFlowRequest = {
            account: account,
            scopes: options.scopes,
        };

        try {
            const msalInstance = this.getMsalClient();
            msalInstance.getTokenCache().deserialize(req.session.tokenCache || "");

            const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);
            
            req.session.tokenCache = msalInstance.getTokenCache().serialize();

            if (!tokenResponse) {
                throw new InteractionRequiredError("null_response", "AcquireTokenSilent return null response", undefined, options.scopes);
            }

            return tokenResponse;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                return next(new InteractionRequiredError(error.errorCode, error.errorMessage, error.subError, options.scopes, error.claims));
            }

            next(error);
        }
    };
}

export default acquireTokenHandler;
