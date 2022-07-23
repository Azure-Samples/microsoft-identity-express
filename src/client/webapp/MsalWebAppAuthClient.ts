/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express, { RequestHandler, Request, Response, NextFunction, Router } from 'express';
import { OIDC_DEFAULT_SCOPES, InteractionRequiredAuthError, ClientAuthError, StringUtils, ResponseMode } from '@azure/msal-common';
import { AuthorizationCodeRequest, AuthorizationUrlRequest, Configuration, SilentFlowRequest } from '@azure/msal-node';
import { Resource, AppSettings, AccessRule, WebAppSettings } from '../../config/AppSettings';
import { TokenRequestOptions, GuardOptions, SignInOptions, SignOutOptions } from '../MiddlewareOptions';
import { AppStages, ErrorMessages, AccessControlConstants, ConfigurationErrorMessages } from '../../utils/Constants';
import { BaseAuthClient } from '../BaseAuthClient';
import { ConfigHelper } from '../../config/ConfigHelper';
import { FetchManager } from '../../network/FetchManager';
import { UrlUtils } from '../../utils/UrlUtils';
import { AppState } from '../../utils/Types';

/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express web apps
 */
export class MsalWebAppAuthClient extends BaseAuthClient {

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
     * @returns {Router}
     */
    initialize(): Router {
        const appRouter = express.Router();

        appRouter.use((req: Request, res: Response, next: NextFunction) => {
            if (!req.session) {
                this.logger.error(ErrorMessages.SESSION_NOT_FOUND);
                throw new Error(ErrorMessages.SESSION_NOT_FOUND);
            }

            next();
        });

        appRouter.post(UrlUtils.getPathFromUrl(this.webAppSettings.authRoutes.redirect), this.handleRedirect());

        if (this.webAppSettings.authRoutes.frontChannelLogout) {
            /**
             * Expose front-channel logout route. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#single-sign-out
             */
            appRouter.get(this.webAppSettings.authRoutes.frontChannelLogout, (req: Request, res: Response) => {
                req.session.destroy(() => {
                    res.sendStatus(200);
                });
            });
        }

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
        return (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const appState = {
                appStage: AppStages.SIGN_IN,
                redirectTo: options.postLoginRedirect,
                csrfToken: req.session.csrfToken,
            } as AppState;

            const authUrlParams = {
                scopes: OIDC_DEFAULT_SCOPES,
            } as AuthorizationUrlRequest;

            const authCodeParams = {
                scopes: OIDC_DEFAULT_SCOPES,
            } as AuthorizationCodeRequest;

            // get url to sign user in
            return this.redirectToAuthCodeUrl(req, res, next, authUrlParams, authCodeParams, appState);
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
        return async (req: Request, res: Response): Promise<void> => {
            const postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLogoutRedirect);

            /**
             * Construct a logout URI and redirect the user to end the
             * session with Azure AD/B2C. For more information, visit:
             * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
             * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
             */
            const logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`;

            const tokenCache = this.msalClient.getTokenCache();

            const account = req.session.account?.homeAccountId
                ?
                await tokenCache.getAccountByHomeId(req.session.account.homeAccountId)
                :
                await tokenCache.getAccountByLocalId(req.session.account?.localAccountId!);

            if (account) {
                await tokenCache.removeAccount(account);
            }

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
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            if (!req.session.key) {
                this.logger.error(ErrorMessages.SESSION_KEY_NOT_FOUND);
                return next(new Error(ErrorMessages.SESSION_KEY_NOT_FOUND));
            }

            if (!req.session.authorizationCodeRequest) {
                this.logger.error(ErrorMessages.AUTH_CODE_REQUEST_OBJECT_NOT_FOUND);
                return next(new Error(ErrorMessages.AUTH_CODE_REQUEST_OBJECT_NOT_FOUND));
            }

            if (req.body.state) {
                const state: AppState = JSON.parse(
                    this.cryptoUtils.decryptData(
                        this.cryptoProvider.base64Decode(req.body.state as string),
                        Buffer.from(req.session.key, 'hex')
                    )
                );

                // check if csrfToken matches
                if (state.csrfToken === req.session.csrfToken) {
                    switch (state.appStage) {
                        case AppStages.SIGN_IN: {
                            // token request should have auth code
                            req.session.authorizationCodeRequest.code = req.body.code as string;

                            try {
                                // exchange auth code for tokens
                                const tokenResponse = await this.msalClient.acquireTokenByCode(
                                    req.session.authorizationCodeRequest
                                );

                                if (!tokenResponse) return res.redirect(this.webAppSettings.authRoutes.unauthorized);

                                req.session.isAuthenticated = true;
                                req.session.account = tokenResponse.account!; // this won't be null in any web app scenario
                                res.redirect(state.redirectTo);
                            } catch (error) {
                                next(error);
                            }
                            break;
                        }

                        case AppStages.ACQUIRE_TOKEN: {
                            // get the name of the resource associated with scope
                            const resourceName = ConfigHelper.getResourceNameFromScopes(
                                req.session.authorizationCodeRequest.scopes,
                                this.webAppSettings
                            );

                            req.session.authorizationCodeRequest.code = req.body.code as string;

                            try {
                                const tokenResponse = await this.msalClient.acquireTokenByCode(
                                    req.session.authorizationCodeRequest
                                );

                                if (!tokenResponse) return res.redirect(this.webAppSettings.authRoutes.unauthorized);

                                req.session.protectedResources = {
                                    [resourceName]: {
                                        accessToken: tokenResponse.accessToken,
                                    } as Resource,
                                };

                                res.redirect(state.redirectTo);
                            } catch (error) {
                                next(error);
                            }
                            break;
                        }

                        default:
                            next(new Error(ErrorMessages.CANNOT_DETERMINE_APP_STAGE));
                            break;
                    }
                } else {
                    res.redirect(this.webAppSettings.authRoutes.unauthorized);
                }
            } else {
                res.redirect(this.webAppSettings.authRoutes.unauthorized);
            }
        };
    }

    /**
     * Middleware that gets tokens via acquireToken*
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
            const scopes = options.resource.scopes;
            const resourceName = ConfigHelper.getResourceNameFromScopes(scopes, this.webAppSettings);

            req.session.protectedResources = {
                [resourceName]: {
                    ...this.webAppSettings.protectedResources[resourceName],
                    accessToken: undefined,
                } as Resource,
            };

            try {
                const silentRequest = {
                    account: req.session.account,
                    scopes: scopes,
                } as SilentFlowRequest;

                // acquire token silently to be used in resource call
                const tokenResponse = await this.msalClient.acquireTokenSilent(silentRequest);

                if (!tokenResponse || StringUtils.isEmpty(tokenResponse.accessToken)) {
                    // In B2C scenarios, sometimes an access token is returned empty.
                    // In that case, we will acquire token interactively instead.

                    throw new InteractionRequiredAuthError(ErrorMessages.INTERACTION_REQUIRED);
                }

                req.session.protectedResources[resourceName].accessToken = tokenResponse.accessToken;
                next();
            } catch (error) {
                // in case there are no cached tokens, initiate an interactive call
                // FIXME: ClientAuthError used for temporary workaround regarding issue: https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/4878
                if (error instanceof InteractionRequiredAuthError || error instanceof ClientAuthError) {
                    const appState = {
                        appStage: AppStages.ACQUIRE_TOKEN,
                        redirectTo: req.originalUrl,
                    } as AppState;

                    const authUrlParams = {
                        scopes: scopes,
                    } as AuthorizationUrlRequest;

                    const authCodeParams = {
                        scopes: scopes,
                    } as AuthorizationCodeRequest;

                    // initiate the first leg of auth code grant to get token
                    return this.redirectToAuthCodeUrl(req, res, next, authUrlParams, authCodeParams, appState);
                } else {
                    next(error);
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

    /**
     * Checks if the user has access for this route, defined in access matrix
     * @param {GuardOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    hasAccess(options: GuardOptions): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            if (!this.webAppSettings.accessMatrix) {
                this.logger.error(ConfigurationErrorMessages.NO_ACCESS_MATRIX_CONFIGURED);
                return next(new Error(ConfigurationErrorMessages.NO_ACCESS_MATRIX_CONFIGURED));
            }

            if (!req.session.account?.idTokenClaims) {
                this.logger.error(ErrorMessages.ID_TOKEN_CLAIMS_NOT_FOUND);
                return next(new Error(ErrorMessages.ID_TOKEN_CLAIMS_NOT_FOUND));
            }

            const checkFor = options.accessRule.hasOwnProperty(AccessControlConstants.GROUPS)
                ? AccessControlConstants.GROUPS
                : AccessControlConstants.ROLES;

            switch (checkFor) {
                case AccessControlConstants.GROUPS:
                    if (!req.session.account.idTokenClaims[AccessControlConstants.GROUPS]) {
                        if (
                            req.session.account.idTokenClaims[AccessControlConstants.CLAIM_NAMES] ||
                            req.session.account.idTokenClaims[AccessControlConstants.CLAIM_SOURCES]
                        ) {
                            return await this.handleOverage(req, res, next, options.accessRule);
                        } else {
                            return res.redirect(this.webAppSettings.authRoutes.unauthorized);
                        }
                    } else {
                        const groups = req.session.account.idTokenClaims[AccessControlConstants.GROUPS] as string[];

                        if (
                            !this.checkAccessRule(req.method, options.accessRule, groups, AccessControlConstants.GROUPS)
                        ) {
                            return res.redirect(this.webAppSettings.authRoutes.unauthorized);
                        }
                    }

                    next();
                    break;

                case AccessControlConstants.ROLES:
                    if (!req.session.account.idTokenClaims[AccessControlConstants.ROLES]) {
                        return res.redirect(this.webAppSettings.authRoutes.unauthorized);
                    } else {
                        const roles = req.session.account.idTokenClaims[AccessControlConstants.ROLES] as string[];

                        if (
                            !this.checkAccessRule(req.method, options.accessRule, roles, AccessControlConstants.ROLES)
                        ) {
                            return res.redirect(this.webAppSettings.authRoutes.unauthorized);
                        }
                    }

                    next();
                    break;

                default:
                    break;
            }
        };
    }

    // ============== UTILS ===============

    /**
     * This method is used to generate an auth code url request
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @param {AuthCodeParams} params: modifies auth code url request
     * @returns {Promise}
     */
    private async redirectToAuthCodeUrl(
        req: Request,
        res: Response,
        next: NextFunction,
        authUrlParams: AuthorizationUrlRequest,
        authCodeParams: AuthorizationCodeRequest,
        appState: AppState
    ): Promise<void> {
        // add session csrfToken for crsf
        req.session.csrfToken = this.cryptoProvider.createNewGuid();

        const key = this.cryptoUtils.createKey(req.session.csrfToken, this.cryptoUtils.generateSalt());
        req.session.key = key.toString('hex');

        const state = JSON.stringify({
            ...appState,
            csrfToken: req.session.csrfToken,
        });

        // prepare the request
        req.session.authorizationUrlRequest = {
            ...authUrlParams,
            state: this.cryptoProvider.base64Encode(this.cryptoUtils.encryptData(state, key)),
            redirectUri: UrlUtils.ensureAbsoluteUrl(req, this.webAppSettings.authRoutes.redirect),
            responseMode: ResponseMode.FORM_POST
        };

        req.session.authorizationCodeRequest = {
            ...authCodeParams,
            redirectUri: UrlUtils.ensureAbsoluteUrl(req, this.webAppSettings.authRoutes.redirect),
            code: ''
        };

        // request an authorization code to exchange for tokens
        try {
            const response = await this.msalClient.getAuthCodeUrl(req.session.authorizationUrlRequest);
            res.redirect(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handles group overage claims by querying MS Graph /memberOf endpoint
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @param {AccessRule} rule: a given access rule
     * @returns {Promise}
     */
    private async handleOverage(req: Request, res: Response, next: NextFunction, rule: AccessRule): Promise<void> {
        if (!req.session.account?.idTokenClaims) {
            this.logger.error(ErrorMessages.ID_TOKEN_CLAIMS_NOT_FOUND);
            return next(new Error(ErrorMessages.ID_TOKEN_CLAIMS_NOT_FOUND));
        }

        const { _claim_names, _claim_sources, ...newIdTokenClaims } = req.session.account.idTokenClaims;

        const silentRequest: SilentFlowRequest = {
            account: req.session.account,
            scopes: AccessControlConstants.GRAPH_MEMBER_SCOPES.split(' '),
        };

        try {
            // acquire token silently to be used in resource call
            const tokenResponse = await this.msalClient.acquireTokenSilent(silentRequest);

            if (!tokenResponse) return res.redirect(this.webAppSettings.authRoutes.unauthorized);

            try {
                const graphResponse = await FetchManager.callApiEndpointWithToken(
                    AccessControlConstants.GRAPH_MEMBERS_ENDPOINT,
                    tokenResponse.accessToken
                );

                /**
                 * Some queries against Microsoft Graph return multiple pages of data either due to server-side paging
                 * or due to the use of the $top query parameter to specifically limit the page size in a request.
                 * When a result set spans multiple pages, Microsoft Graph returns an @odata.nextLink property in
                 * the response that contains a URL to the next page of results. Learn more at https://docs.microsoft.com/graph/paging
                 */
                if (graphResponse.data[AccessControlConstants.PAGINATION_LINK]) {
                    try {
                        const userGroups = await FetchManager.handlePagination(
                            tokenResponse.accessToken,
                            graphResponse.data[AccessControlConstants.PAGINATION_LINK]
                        );

                        req.session.account.idTokenClaims = {
                            ...newIdTokenClaims,
                            groups: userGroups,
                        };

                        if (
                            !this.checkAccessRule(
                                req.method,
                                rule,
                                req.session.account.idTokenClaims[AccessControlConstants.GROUPS] as string[],
                                AccessControlConstants.GROUPS
                            )
                        ) {
                            return res.redirect(this.webAppSettings.authRoutes.unauthorized);
                        } else {
                            return next();
                        }
                    } catch (error) {
                        next(error);
                    }
                } else {
                    req.session.account.idTokenClaims = {
                        ...newIdTokenClaims,
                        groups: graphResponse.data['value'].map((v: any) => v.id),
                    };

                    if (
                        !this.checkAccessRule(
                            req.method,
                            rule,
                            req.session.account.idTokenClaims[AccessControlConstants.GROUPS] as string[],
                            AccessControlConstants.GROUPS
                        )
                    ) {
                        return res.redirect(this.webAppSettings.authRoutes.unauthorized);
                    } else {
                        return next();
                    }
                }
            } catch (error) {
                next(error);
            }
        } catch (error) {
            // TODO: handle silent token acquisition error
            next(error);
        }
    }

    /**
     * Checks if the request passes a given access rule
     * @param {string} method: HTTP method for this route
     * @param {AccessRule} rule: access rule for this route
     * @param {Array} creds: user's credentials i.e. roles or groups
     * @param {string} credType: roles or groups
     * @returns {boolean}
     */
    private checkAccessRule(method: string, rule: AccessRule, creds: string[], credType: string): boolean {
        if (rule.methods.includes(method)) {
            switch (credType) {
                case AccessControlConstants.GROUPS:
                    if (!rule.groups || rule.groups.filter(elem => creds.includes(elem)).length < 1) {
                        return false;
                    }
                    break;

                case AccessControlConstants.ROLES:
                    if (!rule.roles || rule.roles!.filter(elem => creds.includes(elem)).length < 1) {
                        return false;
                    }
                    break;

                default:
                    break;
            }
        } else {
            return false;
        }

        return true;
    }
}
