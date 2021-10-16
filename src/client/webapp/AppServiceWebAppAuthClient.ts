
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express, {
    Router,
    RequestHandler,
    Request,
    Response,
    NextFunction
} from "express";

import { AccountInfo } from "@azure/msal-common";
import { BaseAuthClient } from "../BaseAuthClient";
import { Configuration } from "@azure/msal-node";

import { TokenValidator } from "../../crypto/TokenValidator";
import { AccessTokenClaims, IdTokenClaims } from "../../crypto/AuthToken";
import { AppSettings, Resource } from "../../config/AppSettings";
import { ConfigHelper } from "../../config/ConfigHelper";
import { UrlUtils } from "../../utils/UrlUtils";

import {
    GuardOptions,
    HandleRedirectOptions,
    InitializationOptions,
    SignInOptions,
    SignOutOptions,
    TokenRequestOptions
} from "../MiddlewareOptions";

import {
    AppServiceAuthenticationHeaders,
    AppServiceEnvironmentVariables,
    AppServiceAuthenticationEndpoints,
    AppServiceAuthenticationQueryParameters,
    ErrorMessages
} from "../../utils/Constants";

export class AppServiceWebAppAuthClient extends BaseAuthClient {

    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration) {
        super(appSettings, msalConfig);
    }

    /**
     * Initialize AuthProvider and set default routes and handlers
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    initialize(options?: InitializationOptions): Router {

        const appRouter = express.Router();

        // handle redirect
        appRouter.get(UrlUtils.getPathFromUrl(this.appSettings.authRoutes.redirect), this.handleRedirect());
        appRouter.post(UrlUtils.getPathFromUrl(this.appSettings.authRoutes.redirect), this.handleRedirect());
        
        appRouter.use((req: Request, res: Response, next: NextFunction): void => {

            
            if (!req.session.isAuthenticated) {
                // check headers for id token
                const rawIdToken = req.headers[AppServiceAuthenticationHeaders.APP_SERVICE_ID_TOKEN_HEADER.toLowerCase()] as string;

                if (rawIdToken) {

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
            }

            next();
        });

        return appRouter;
    }

    /**
     * Initiates sign in flow
     * @param {SignInOptions} options: options to modify login request
     * @returns {RequestHandler}
     */
    signIn(options?: SignInOptions): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            let loginUri;
            const postLoginRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLoginRedirect);
            loginUri = "https://" + process.env[AppServiceEnvironmentVariables.WEBSITE_HOSTNAME] + AppServiceAuthenticationEndpoints.AAD_SIGN_IN_ENDPOINT + AppServiceAuthenticationQueryParameters.POST_LOGIN_REDIRECT_QUERY_PARAM + postLoginRedirectUri;
            res.redirect(loginUri);
        }
    }


    /**
     * Initiate sign out and destroy the session
     * @param options: options to modify logout request 
     * @returns {RequestHandler}
     */
    signOut(options?: SignOutOptions): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            const postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLogoutRedirect);
            const logoutUri = "https://" + process.env[AppServiceEnvironmentVariables.WEBSITE_HOSTNAME] + AppServiceAuthenticationEndpoints.AAD_SIGN_OUT_ENDPOINT + AppServiceAuthenticationQueryParameters.POST_LOGOUT_REDIRECT_QUERY_PARAM + postLogoutRedirectUri;

            req.session.destroy(() => {
                res.redirect(logoutUri);
            });
        }
    }

    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @param {HandleRedirectOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    private handleRedirect(options?: HandleRedirectOptions): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            next();
        }
    }

    /**
     * Middleware that gets tokens
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getToken(options: TokenRequestOptions): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

            // get scopes for token request
            const resourceName = ConfigHelper.getResourceNameFromScopes(options.resource.scopes, this.appSettings)

            if (!req.session.protectedResources) {
                req.session.protectedResources = {}
            }

            req.session.protectedResources = {
                [resourceName]: {
                    ...this.appSettings.protectedResources[resourceName],
                    accessToken: null,
                } as Resource
            };

            const rawAccessToken = req.headers[AppServiceAuthenticationHeaders.APP_SERVICE_ACCESS_TOKEN_HEADER.toLowerCase()] as string;

            if (rawAccessToken) {

                const accessTokenClaims: AccessTokenClaims = TokenValidator.decodeAuthToken(rawAccessToken).payload;

                // get the name of the resource associated with scope
                const scopes = accessTokenClaims.scp.split(" ");
                const effectiveScopes = ConfigHelper.getEffectiveScopes(scopes);

                if (options.resource.scopes.every(elem => effectiveScopes.includes(elem))) {
                    req.session.protectedResources[resourceName].accessToken = rawAccessToken;
                    return next();
                } else {
                    return next(new Error("No tokens found for given scopes"));
                }
            }
        }
    }

    /**
     * Check if authenticated in session
     * @param {GuardOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    isAuthenticated(options?: GuardOptions): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            if (req.session) {
                if (!req.session.isAuthenticated) {
                    this.logger.error(ErrorMessages.NOT_PERMITTED);
                    return res.redirect(this.appSettings.authRoutes.unauthorized);
                }

                next();
            } else {
                this.logger.error(ErrorMessages.SESSION_NOT_FOUND);
                res.redirect(this.appSettings.authRoutes.unauthorized);
            }
        }
    };
}