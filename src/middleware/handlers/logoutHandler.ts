/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { LogoutOptions } from "../MiddlewareOptions";
import { Request, Response, RequestHandler } from "../MiddlewareTypes";
import { UrlUtils } from "../../utils/UrlUtils";

function logoutHandler(this: WebAppAuthProvider, options: LogoutOptions): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
        this.getLogger().trace("logoutHandler called");
        
        let logoutUri = options.postLogoutRedirectUri || "/";

        try {
            const tokenCache = this.getMsalClient().getTokenCache();
            const account = await tokenCache.getAccountByHomeId(req.authContext.getAccount().homeAccountId);

            if (account) {
                await tokenCache.removeAccount(account);
            }
        } catch (error) {
            this.logger.error(`Error occurred while clearing cache for user: ${JSON.stringify(error)}`);
        }

        // TODO: should be default
        if (options.idpLogout) {
            /**
             * Construct a logout URI and redirect the user to end the
             * session with Azure AD. For more information, visit:
             * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
             */

            const postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(
                options.postLogoutRedirectUri || "/",
                req.protocol,
                req.get("host") || req.hostname
            );

            // FIXME: need the canonical uri (ending with slash) && esnure absolute url
            logoutUri = `${this.getMsalConfig().auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`;
        }

        req.session.destroy(() => {
            // TODO: remove/expire cookie?
            res.redirect(logoutUri);
        });
    };
}

export default logoutHandler;
