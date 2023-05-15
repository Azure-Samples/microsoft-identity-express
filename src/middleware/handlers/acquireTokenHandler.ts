/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AuthenticationResult, InteractionRequiredAuthError, SilentFlowRequest } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { Request, Response, NextFunction, RequestHandler } from "../MiddlewareTypes";
import { TokenRequestOptions } from "../MiddlewareOptions";
import { InteractionRequiredError } from "../../error/InteractionRequiredError";
import { AppSettingsHelper } from "../../config/AppSettingsHelper";

function acquireTokenHandler(this: WebAppAuthProvider, options: TokenRequestOptions, useAsMiddleware?: boolean): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<AuthenticationResult | void> => {
        this.getLogger().trace("acquireTokenHandler called");

        try {
            const account = options.account || req.session.account;

            if (!account) {
                throw new InteractionRequiredError("no_account_found", "No account found either in options or in session", undefined, options.scopes);
            }
    
            const silentRequest: SilentFlowRequest = {
                account: account,
                scopes: options.scopes,
            };

            const msalInstance = this.getMsalClient();
            msalInstance.getTokenCache().deserialize(req.session.tokenCache || "");
            const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);
            req.session.tokenCache = msalInstance.getTokenCache().serialize();

            if (!tokenResponse) {
                throw new InteractionRequiredError("null_response", "AcquireTokenSilent return null response", undefined, options.scopes);
            }

            if (useAsMiddleware) {
                if (this.webAppSettings.protectedResources) {
                    const resource = AppSettingsHelper.getResourceNameFromScopes(
                        tokenResponse.scopes,
                        this.webAppSettings.protectedResources
                    );

                    if (!req.session.protectedResources) {
                        req.session.protectedResources = {
                            [resource]: tokenResponse
                        };
                    } else {
                        req.session.protectedResources[resource] = tokenResponse;
                    }
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
                    options.scopes,
                    error.claims)
                ); // TODO: consider useAsMiddleware enabled
            }

            next(error);
        }
    };
}

export default acquireTokenHandler;
