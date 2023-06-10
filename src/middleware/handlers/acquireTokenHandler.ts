/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AuthenticationResult, InteractionRequiredAuthError, SilentFlowRequest } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { Request, Response, NextFunction, RequestHandler } from "../MiddlewareTypes";
import { TokenRequestOptions, TokenRequestMiddlewareOptions } from "../MiddlewareOptions";
import { InteractionRequiredError } from "../../error/InteractionRequiredError";

function acquireTokenHandler(
    this: WebAppAuthProvider, 
    options: TokenRequestOptions, 
    useAsMiddlewareOptions?: TokenRequestMiddlewareOptions
): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<AuthenticationResult | void> => {
        this.getLogger().trace("acquireTokenHandler called");

        try {
            const account = options.account || req.session.account;

            if (!account) {
                throw new InteractionRequiredError(
                    "no_account_found", 
                    "No account found either in options or in session", 
                    undefined, 
                    options
                );
            }
    
            const silentRequest: SilentFlowRequest = {
                account: account,
                scopes: options.scopes,
                claims: options.claims,
                tokenQueryParameters: options.tokenQueryParameters,
            };

            const msalInstance = this.getMsalClient();

            msalInstance.getTokenCache().deserialize(req.session.tokenCache);

            const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);

            req.session.tokenCache = msalInstance.getTokenCache().serialize();

            if (!tokenResponse) {
                throw new InteractionRequiredError(
                    "null_response", 
                    "AcquireTokenSilent return null response", 
                    undefined, 
                    options
                );
            }

            if (useAsMiddlewareOptions) {
                if (!req.session.protectedResources) {
                    req.session.protectedResources = {
                        [useAsMiddlewareOptions.resourceName]: tokenResponse
                    };
                } else {
                    req.session.protectedResources[useAsMiddlewareOptions.resourceName] = tokenResponse;
                }

                return next();
            }

            return tokenResponse;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                return next(new InteractionRequiredError(
                    error.errorCode,
                    error.errorMessage,
                    error.subError,
                    options
                ));
            }

            next(error);
        }
    };
}

export default acquireTokenHandler;
