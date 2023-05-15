/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AuthorizationCodePayload, AuthorizationCodeRequest } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { Request, Response, NextFunction, RequestHandler } from "../MiddlewareTypes";
import { AppState } from "../MiddlewareOptions";
import { AppSettingsHelper } from "../../config/AppSettingsHelper";

function redirectHandler(this: WebAppAuthProvider): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.getLogger().verbose("redirectHandler called");

        if (!req.body || !req.body.code) {
            this.logger.error("Authorization code not found in the response");
            return next(new Error("AUTH_CODE_NOT_FOUND")); // TODO: need to create a custom error for this
        }

        const tokenRequest: AuthorizationCodeRequest = {
            ...req.session.tokenRequestParams,
            code: req.body.code as string
        };

        try {
            const msalInstance = this.getMsalClient();
            msalInstance.getTokenCache().deserialize(req.session.tokenCache || "");

            const tokenResponse = await msalInstance.acquireTokenByCode(
                tokenRequest,
                req.body as AuthorizationCodePayload
            );

            req.session.tokenCache = msalInstance.getTokenCache().serialize();

            if (!tokenResponse) {
                return res.status(403).send("No token response found");
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            req.session.account = tokenResponse.account!; // account will never be null in this grant type
            req.session.isAuthenticated = true;
            
            if (this.webAppSettings.protectedResources) {
                // TODO: what if just acquiring a token without configuring protectedResources?
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

            const { redirectTo } = req.body.state ?
                JSON.parse(this.getCryptoProvider().base64Decode(req.body.state as string)) as AppState
                :
                { redirectTo: "/" };

            res.redirect(redirectTo);
        } catch (error) {
            next(error);
        }
    };
}

export default redirectHandler;
