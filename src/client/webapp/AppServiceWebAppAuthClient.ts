/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express, { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { AccountInfo, AuthToken } from '@azure/msal-common';
import { Configuration } from '@azure/msal-node';

import { BaseAuthClient } from '../BaseAuthClient';
import { AccessTokenClaims, IdTokenClaims } from '../../utils/Types';
import { AppSettings, Resource, WebAppSettings } from '../../config/AppSettings';
import { ConfigHelper } from '../../config/ConfigHelper';
import { UrlUtils } from '../../utils/UrlUtils';
import { SignInOptions, SignOutOptions, TokenRequestOptions } from '../MiddlewareOptions';
import {
    AppServiceAuthenticationHeaders,
    AppServiceEnvironmentVariables,
    AppServiceAuthenticationEndpoints,
    AppServiceAuthenticationQueryParameters,
    ErrorMessages,
    ConfigurationErrorMessages,
} from '../../utils/Constants';

export class AppServiceWebAppAuthClient extends BaseAuthClient {

    webAppSettings: WebAppSettings;

    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration) {
        super(appSettings, msalConfig);
        this.webAppSettings = appSettings as WebAppSettings;
    }

    /**
     * Initialize AuthProvider and set default routes and handlers
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    initialize(): Router {
        const appRouter = express.Router();

        // handle redirect
        appRouter.get(UrlUtils.getPathFromUrl(this.webAppSettings.authRoutes.redirect), this.handleRedirect());
        appRouter.post(UrlUtils.getPathFromUrl(this.webAppSettings.authRoutes.redirect), this.handleRedirect());

        appRouter.use((req: Request, res: Response, next: NextFunction): void => {
            if (!req.session) {
                this.logger.error(ErrorMessages.SESSION_NOT_FOUND);
                throw new Error(ErrorMessages.SESSION_NOT_FOUND);
            }

            if (!req.session.isAuthenticated) {
                // check headers for id token
                const rawIdToken = req.headers[
                    AppServiceAuthenticationHeaders.APP_SERVICE_ID_TOKEN_HEADER.toLowerCase()
                ] as string;

                if (rawIdToken) {
                    // parse the id token
                    const idTokenClaims: IdTokenClaims = AuthToken.extractTokenClaims(rawIdToken, this.cryptoProvider);

                    req.session.isAuthenticated = true;

                    req.session.account = {
                        tenantId: idTokenClaims.tid,
                        homeAccountId: idTokenClaims.oid + '.' + idTokenClaims.tid,
                        localAccountId: idTokenClaims.oid,
                        environment: idTokenClaims.iss?.split('://')[1].split('/')[0],
                        username: idTokenClaims.preferred_username,
                        name: idTokenClaims.name,
                        idTokenClaims: idTokenClaims,
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
    signIn(
        options: SignInOptions = {
            postLoginRedirect: '/',
            failureRedirect: '/',
        }
    ): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            let loginUri;
            const postLoginRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLoginRedirect);
            loginUri =
                'https://' +
                process.env[AppServiceEnvironmentVariables.WEBSITE_HOSTNAME] +
                AppServiceAuthenticationEndpoints.AAD_SIGN_IN_ENDPOINT +
                AppServiceAuthenticationQueryParameters.POST_LOGIN_REDIRECT_QUERY_PARAM +
                postLoginRedirectUri;
            res.redirect(loginUri);
        };
    }

    /**
     * Initiate sign out and destroy the session
     * @param {SignOutOptions} options: options to modify logout request
     * @returns {RequestHandler}
     */
    signOut(
        options: SignOutOptions = {
            postLogoutRedirect: '/',
        }
    ): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            const postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLogoutRedirect);
            const logoutUri =
                'https://' +
                process.env[AppServiceEnvironmentVariables.WEBSITE_HOSTNAME] +
                AppServiceAuthenticationEndpoints.AAD_SIGN_OUT_ENDPOINT +
                AppServiceAuthenticationQueryParameters.POST_LOGOUT_REDIRECT_QUERY_PARAM +
                postLogoutRedirectUri;

            req.session.destroy(() => {
                res.redirect(logoutUri);
            });
        };
    }

    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @returns {RequestHandler}
     */
    private handleRedirect(): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            next();
        };
    }

    /**
     * Middleware that gets tokens
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getToken(options: TokenRequestOptions): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

            if (!this.webAppSettings.protectedResources) {
                this.logger.error(ConfigurationErrorMessages.NO_PROTECTED_RESOURCE_CONFIGURED);
                return next(new Error(ConfigurationErrorMessages.NO_PROTECTED_RESOURCE_CONFIGURED));
            }

            // get scopes for token request
            const resourceName = ConfigHelper.getResourceNameFromScopes(options.resource.scopes, this.webAppSettings);

            req.session.protectedResources = {
                [resourceName]: {
                    ...this.webAppSettings.protectedResources[resourceName],
                    accessToken: undefined,
                } as Resource,
            };

            const rawAccessToken = req.headers[
                AppServiceAuthenticationHeaders.APP_SERVICE_ACCESS_TOKEN_HEADER.toLowerCase()
            ] as string;

            if (rawAccessToken) {
                const accessTokenClaims = AuthToken.extractTokenClaims(
                    rawAccessToken,
                    this.cryptoProvider
                ) as AccessTokenClaims;

                // get the name of the resource associated with scope
                const scopes = accessTokenClaims?.scp.split(' ');
                const effectiveScopes = ConfigHelper.getEffectiveScopes(scopes);

                if (options.resource.scopes.every(elem => effectiveScopes.includes(elem))) {
                    req.session.protectedResources[resourceName].accessToken = rawAccessToken;
                    return next();
                } else {
                    return next(new Error('No tokens found for given scopes'));
                }
            }
        };
    }

    /**
     * Check if authenticated in session
     * @returns {RequestHandler}
     */
    isAuthenticated(): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            if (!req.session.isAuthenticated) {
                return res.redirect(this.webAppSettings.authRoutes.unauthorized);
            }

            next();
        };
    }
}
