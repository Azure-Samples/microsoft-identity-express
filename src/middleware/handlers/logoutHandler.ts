/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { SignOutOptions } from "../MiddlewareOptions";
import { Request, Response, RequestHandler } from "../MiddlewareTypes";
import { UrlUtils } from "../../utils/UrlUtils";

function logoutHandler(
    this: WebAppAuthProvider,
    options: SignOutOptions
): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
        this.getLogger().verbose("logoutHandler called");

        let logoutUri = options.postLogoutRedirectUri || "/";

        const tokenCache = this.getMsalClient().getTokenCache();
        const account = await tokenCache.getAccountByHomeId(req.session.account.homeAccountId);

        if (account) {
            await tokenCache.removeAccount(account);
        }

        if (options.idpLogout) {
            /**
             * Construct a logout URI and redirect the user to end the
             * session with Azure AD/B2C. For more information, visit:
             * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
             * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
             */

            const postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(
                options.postLogoutRedirectUri || "/",
                req.protocol,
                req.get("host") || req.hostname
            );

            // FIXME: need the canonical uri (ending with slash)
            logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`;
        }

        req.session.destroy(() => {
            // TODO: destroy cookie? Or set expiry
            res.redirect(logoutUri);
        });
    };
}

export default logoutHandler;
