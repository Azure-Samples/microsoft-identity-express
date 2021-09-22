
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    RequestHandler,
    Request,
    Response,
    NextFunction
} from "express";

import { AccountInfo, OIDC_DEFAULT_SCOPES } from "@azure/msal-common";

import { TokenValidator } from "../../crypto/TokenValidator";
import { AccessTokenClaims, IdTokenClaims } from "../../crypto/AuthToken";
import { Resource } from "../../config/AppSettings";
import { ConfigHelper } from "../../config/ConfigHelper";

import {
    AppServiceAuthenticationHeaders,
    AppServiceEnvironmentVariables,
    AppServiceAuthenticationEndpoints,
    AppServiceAuthenticationQueryParameters
} from "../../utils/Constants";

export class AppServiceAuthHelper {

    constructor() {
    
    }

    static isAppServiceAuthEnabled(): boolean {
        if (process.env[AppServiceEnvironmentVariables.WEBSITE_AUTH_ENABLED] === "True") {
            return true;
        } else {
            return false;
        }
    }

    static getEffectiveScopesFromLoginParams(): string[] {
        const loginParams = process.env[AppServiceEnvironmentVariables.WEBSITE_AUTH_LOGIN_PARAMS] as string;
        const scopesList = loginParams.split("scope=")[1].split(" ");
        const effectiveScopesList = scopesList.filter(scope => !OIDC_DEFAULT_SCOPES.includes(scope));
        return effectiveScopesList;
    }

    static getLoginUri(postLoginRedirectUri): string {
        const loginUri = "https://" + process.env[AppServiceEnvironmentVariables.WEBSITE_HOSTNAME] + AppServiceAuthenticationEndpoints.AAD_SIGN_IN_ENDPOINT + AppServiceAuthenticationQueryParameters.POST_LOGIN_REDIRECT_QUERY_PARAM + postLoginRedirectUri;
        return loginUri;
    }

    static getLogoutUri(postLogoutRedirectUri): string {
        const logoutUri = "https://" + process.env[AppServiceEnvironmentVariables.WEBSITE_HOSTNAME] + AppServiceAuthenticationEndpoints.AAD_SIGN_OUT_ENDPOINT + AppServiceAuthenticationQueryParameters.POST_LOGOUT_REDIRECT_QUERY_PARAM + postLogoutRedirectUri;
        return logoutUri;
    }

    handleAppServiceAuth(appSettings): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

            // check headers for id and access tokens
            const rawIdToken = req.headers[AppServiceAuthenticationHeaders.APP_SERVICE_ID_TOKEN_HEADER.toLowerCase()] as string;
            const rawAccessToken = req.headers[AppServiceAuthenticationHeaders.APP_SERVICE_ACCESS_TOKEN_HEADER.toLowerCase()] as string;

            if (rawIdToken && !req.session.isAuthenticated) {

                // TODO: validate the id token

                // parse the id token
                const idTokenClaims: IdTokenClaims = TokenValidator.decodeAuthToken(rawIdToken).payload;

                req.session.isAuthenticated = true;

                req.session.account = {
                    tenantId: idTokenClaims.tid,
                    homeAccountId: idTokenClaims.oid + "." + idTokenClaims.tid,
                    localAccountId: idTokenClaims.oid,
                    environment: idTokenClaims.iss.split("://")[1].split("/")[0],
                    username: idTokenClaims.preferred_username,
                    name: idTokenClaims.name,
                    idTokenClaims: idTokenClaims
                } as AccountInfo;
            }

            if (rawAccessToken) {

                const accessTokenClaims: AccessTokenClaims = TokenValidator.decodeAuthToken(rawAccessToken).payload;

                // get the name of the resource associated with scope
                const scopes = accessTokenClaims.scp;
                const resourceName = ConfigHelper.getResourceNameFromScopes(scopes, appSettings);

                if (!req.session.protectedResources) {
                    req.session.protectedResources = {}
                }

                req.session.protectedResources = {
                    [resourceName]: {
                        ...appSettings.protectedResources[resourceName],
                        accessToken: rawAccessToken,
                    } as Resource
                };
            }

            next();
        }
    };
}