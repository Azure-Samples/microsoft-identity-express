/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ResponseMode } from "@azure/msal-common";
import { AuthorizationCodeRequest, AuthorizationUrlRequest } from "@azure/msal-node";

import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { SignInOptions, AppState } from "../MiddlewareOptions";
import { Request, Response, NextFunction, RequestHandler } from "../MiddlewareTypes";
import { UrlUtils } from "../../utils/UrlUtils";
import { EMPTY_STRING } from "../../utils/Constants";

function loginHandler(
    this: WebAppAuthProvider,
    options: SignInOptions
): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.getLogger().verbose("LoginHandler called");

        // eslint-disable-next-line no-console
        console.log(req.originalUrl);

        const state: AppState = {
            redirectTo: options.postLoginRedirectUri || "/",
            customState: options.state
        };

        const authUrlParams: AuthorizationUrlRequest = {
            scopes: options.scopes,
            state: this.getCryptoProvider().base64Encode(JSON.stringify(state)),
            redirectUri: UrlUtils.ensureAbsoluteUrl(
                this.webAppSettings.authRoutes.redirectUri,
                req.protocol,
                req.get("host") || req.hostname
            ),
            responseMode: ResponseMode.FORM_POST,
            prompt: options.prompt || undefined,
        };

        const authCodeParams: AuthorizationCodeRequest = {
            scopes: authUrlParams.scopes,
            state: authUrlParams.state,
            redirectUri: authUrlParams.redirectUri,
            code: EMPTY_STRING,
        };

        // prepare the request
        req.session.tokenRequestParams = {
            ...authCodeParams,
        };

        try {
            // request an authorization code to exchange for tokens
            const response = await this.getMsalClient().getAuthCodeUrl(authUrlParams);
            res.redirect(response);
        } catch (error) {
            next(error);
        }
    };
}

export default loginHandler;
