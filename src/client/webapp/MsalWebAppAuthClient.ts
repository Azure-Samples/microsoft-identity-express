/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express, {
    RequestHandler,
    Request,
    Response,
    NextFunction,
    Router
} from "express";

import {
    OIDC_DEFAULT_SCOPES,
    InteractionRequiredAuthError,
    StringUtils,
} from "@azure/msal-common";

import {
    Configuration,
    SilentFlowRequest,
    AuthenticationResult
} from "@azure/msal-node";

import { BaseAuthClient } from "../BaseAuthClient";
import { ConfigHelper } from "../../config/ConfigHelper";
import { IdTokenClaims } from "../../crypto/AuthToken";
import { FetchManager } from "../../network/FetchManager";
import { UrlUtils } from "../../utils/UrlUtils";
import { CryptoUtils } from "../../utils/CryptoUtils"

import {
    Resource,
    AppSettings,
    AccessRule,
} from "../../config/AppSettings";

import { AuthCodeParams } from "../../utils/Types";

import {
    InitializationOptions,
    TokenRequestOptions,
    GuardOptions,
    SignInOptions,
    SignOutOptions,
    HandleRedirectOptions
} from "../MiddlewareOptions";

import {
    AppStages,
    ErrorMessages,
    AccessControlConstants,
    InfoMessages
} from "../../utils/Constants";


/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express MVC web apps
 */
export class MsalWebAppAuthClient extends BaseAuthClient {
    
    private cryptoUtils: CryptoUtils;

    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration) {
        super(appSettings, msalConfig);
        this.cryptoUtils = new CryptoUtils();
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

        appRouter.use((req: Request, res: Response, next: NextFunction) => {

            if (!req.session) {
                // TODO: handle gracefully
                throw new Error(ErrorMessages.SESSION_NOT_FOUND);
            }

            // add session nonce for crsf
            req.session.nonce = this.cryptoProvider.createNewGuid();
            next();
        });

        if (this.appSettings.authRoutes.frontChannelLogout) {
            /**
             * Expose front-channel logout route. For more information, visit: 
             * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#single-sign-out
             */
            appRouter.get(this.appSettings.authRoutes.frontChannelLogout, (req: Request, res: Response, next: NextFunction) => {
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
    signIn(options?: SignInOptions): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): Promise<void> => {

            const key = this.cryptoUtils.createKey(req.session.nonce, this.cryptoUtils.generateSalt());
            req.session.key = key.toString("hex");

            const state = this.cryptoProvider.base64Encode(
                this.cryptoUtils.encryptData(JSON.stringify({
                    stage: AppStages.SIGN_IN,
                    path: options.postLoginRedirect,
                    nonce: req.session.nonce,
                }), key)
            );

            const params: AuthCodeParams = {
                authority: this.msalConfig.auth.authority,
                scopes: OIDC_DEFAULT_SCOPES,
                state: state,
                redirect: UrlUtils.ensureAbsoluteUrl(req, this.appSettings.authRoutes.redirect)
            };

            // get url to sign user in
            return this.getAuthCode(req, res, next, params);

        }
    };

    /**
     * Initiate sign out and destroy the session
     * @param options: options to modify logout request 
     * @returns {RequestHandler}
     */
    signOut(options?: SignOutOptions): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {

            const postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLogoutRedirect);

            /**
             * Construct a logout URI and redirect the user to end the
             * session with Azure AD/B2C. For more information, visit:
             * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
             * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
             */
            const logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`;

            req.session.destroy(() => {
                res.redirect(logoutUri);
            });
        }
    };

    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @param {HandleRedirectOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    private handleRedirect(options?: HandleRedirectOptions): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            // TODO: handle form_post method

            if (req.query.state) {
                const state = JSON.parse(this.cryptoUtils.decryptData(this.cryptoProvider.base64Decode(req.query.state as string), Buffer.from(req.session.key, "hex")));

                // check if nonce matches
                if (state.nonce === req.session.nonce) {
                    switch (state.stage) {
                        case AppStages.SIGN_IN: {
                            // token request should have auth code
                            req.session.tokenRequest.code = req.query.code as string;

                            try {
                                // exchange auth code for tokens
                                const tokenResponse: AuthenticationResult = await this.msalClient.acquireTokenByCode(req.session.tokenRequest);

                                try {
                                    const isIdTokenValid = await this.tokenValidator.validateIdToken(tokenResponse.idToken);

                                    if (isIdTokenValid) {

                                        // assign session variables
                                        req.session.isAuthenticated = true;
                                        req.session.account = tokenResponse.account;

                                        res.redirect(state.path);
                                    } else {
                                        this.logger.error(ErrorMessages.INVALID_TOKEN);
                                        res.redirect(this.appSettings.authRoutes.unauthorized);
                                    }
                                } catch (error) {
                                    this.logger.error(ErrorMessages.CANNOT_VALIDATE_TOKEN);
                                    next(error)
                                }
                            } catch (error) {
                                this.logger.error(ErrorMessages.TOKEN_ACQUISITION_FAILED);
                                next(error)
                            }
                            break;
                        }

                        case AppStages.ACQUIRE_TOKEN: {
                            // get the name of the resource associated with scope
                            const resourceName = ConfigHelper.getResourceNameFromScopes(req.session.tokenRequest.scopes, this.appSettings);

                            req.session.tokenRequest.code = req.query.code as string;

                            try {
                                const tokenResponse: AuthenticationResult = await this.msalClient.acquireTokenByCode(req.session.tokenRequest);
                                req.session.protectedResources[resourceName].accessToken = tokenResponse.accessToken;
                                res.redirect(state.path);
                            } catch (error) {
                                this.logger.error(ErrorMessages.TOKEN_ACQUISITION_FAILED);
                                next(error);
                            }
                            break;
                        }

                        default:
                            this.logger.error(ErrorMessages.CANNOT_DETERMINE_APP_STAGE);
                            res.redirect(this.appSettings.authRoutes.error);
                            break;
                    }
                } else {
                    this.logger.error(ErrorMessages.NONCE_MISMATCH);
                    res.redirect(this.appSettings.authRoutes.unauthorized);
                }
            } else {
                this.logger.error(ErrorMessages.STATE_NOT_FOUND);
                res.redirect(this.appSettings.authRoutes.unauthorized);
            }
        }
    };

    /**
     * Middleware that gets tokens via acquireToken*
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getToken(options: TokenRequestOptions): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

            // get scopes for token request
            const scopes = options.resource.scopes;
            const resourceName = ConfigHelper.getResourceNameFromScopes(scopes, this.appSettings)

            if (!req.session.protectedResources) {
                req.session.protectedResources = {}
            }

            req.session.protectedResources = {
                [resourceName]: {
                    ...this.appSettings.protectedResources[resourceName],
                    accessToken: null,
                } as Resource
            };

            try {
                const silentRequest: SilentFlowRequest = {
                    account: req.session.account,
                    scopes: scopes,
                };

                // acquire token silently to be used in resource call
                const tokenResponse: AuthenticationResult = await this.msalClient.acquireTokenSilent(silentRequest);

                // In B2C scenarios, sometimes an access token is returned empty.
                // In that case, we will acquire token interactively instead.
                if (StringUtils.isEmpty(tokenResponse.accessToken)) {
                    this.logger.error(ErrorMessages.TOKEN_NOT_FOUND);
                    throw new InteractionRequiredAuthError(ErrorMessages.INTERACTION_REQUIRED);
                }

                req.session.protectedResources[resourceName].accessToken = tokenResponse.accessToken;
                next();
            } catch (error) {
                // in case there are no cached tokens, initiate an interactive call
                if (error instanceof InteractionRequiredAuthError) {
                    
                    const key = this.cryptoUtils.createKey(req.session.nonce, this.cryptoUtils.generateSalt());
                    req.session.key = key.toString("hex");

                    const state = this.cryptoProvider.base64Encode(
                        this.cryptoUtils.encryptData(JSON.stringify({
                            stage: AppStages.ACQUIRE_TOKEN,
                            path: req.originalUrl,
                            nonce: req.session.nonce,
                        }), key)
                    );

                    const params: AuthCodeParams = {
                        authority: this.msalConfig.auth.authority,
                        scopes: scopes,
                        state: state,
                        redirect: UrlUtils.ensureAbsoluteUrl(req, this.appSettings.authRoutes.redirect),
                        account: req.session.account,
                    };

                    // initiate the first leg of auth code grant to get token
                    return this.getAuthCode(req, res, next, params);
                } else {
                    next(error);
                }
            }
        }
    };

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

    /**
     * Checks if the user has access for this route, defined in access matrix
     * @param {GuardOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    hasAccess(options?: GuardOptions): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            if (req.session && this.appSettings.accessMatrix) {

                const checkFor = options.accessRule.hasOwnProperty(AccessControlConstants.GROUPS) ? AccessControlConstants.GROUPS : AccessControlConstants.ROLES;

                switch (checkFor) {
                    case AccessControlConstants.GROUPS:

                        if (req.session.account.idTokenClaims[AccessControlConstants.GROUPS] === undefined) {
                            if (req.session.account.idTokenClaims[AccessControlConstants.CLAIM_NAMES]
                                || req.session.account.idTokenClaims[AccessControlConstants.CLAIM_SOURCES]) {
                                this.logger.warning(InfoMessages.OVERAGE_OCCURRED);
                                return await this.handleOverage(req, res, next, options.accessRule);
                            } else {
                                this.logger.error(ErrorMessages.USER_HAS_NO_GROUP);
                                return res.redirect(this.appSettings.authRoutes.unauthorized);
                            }
                        } else {
                            const groups = req.session.account.idTokenClaims[AccessControlConstants.GROUPS];

                            if (!this.checkAccessRule(req.method, options.accessRule, groups, AccessControlConstants.GROUPS)) {
                                return res.redirect(this.appSettings.authRoutes.unauthorized);
                            }
                        }

                        next();
                        break;

                    case AccessControlConstants.ROLES:
                        if (req.session.account.idTokenClaims[AccessControlConstants.ROLES] === undefined) {
                            this.logger.error(ErrorMessages.USER_HAS_NO_ROLE);
                            return res.redirect(this.appSettings.authRoutes.unauthorized);
                        } else {
                            const roles = req.session.account.idTokenClaims[AccessControlConstants.ROLES];

                            if (!this.checkAccessRule(req.method, options.accessRule, roles, AccessControlConstants.ROLES)) {
                                return res.redirect(this.appSettings.authRoutes.unauthorized);
                            }
                        }

                        next();
                        break;

                    default:
                        break;
                }
            } else {
                res.redirect(this.appSettings.authRoutes.unauthorized);
            }
        }
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
    private async getAuthCode(req: Request, res: Response, next: NextFunction, params: AuthCodeParams): Promise<void> {

        // prepare the request
        req.session.authCodeRequest = {
            authority: params.authority,
            scopes: params.scopes,
            state: params.state,
            redirectUri: params.redirect,
            prompt: params.prompt,
            account: params.account,
        }

        req.session.tokenRequest = {
            authority: params.authority,
            scopes: params.scopes,
            redirectUri: params.redirect,
            code: undefined,
        }

        // request an authorization code to exchange for tokens
        try {
            const response = await this.msalClient.getAuthCodeUrl(req.session.authCodeRequest);
            res.redirect(response);
        } catch (error) {
            this.logger.error(ErrorMessages.AUTH_CODE_NOT_OBTAINED);
            next(error);
        }
    };

    /**
     * Handles group overage claims by querying MS Graph /memberOf endpoint
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @param {AccessRule} rule: a given access rule
     * @returns {Promise}
     */
    private async handleOverage(req: Request, res: Response, next: NextFunction, rule: AccessRule): Promise<void> {
        const { _claim_names, _claim_sources, ...newIdTokenClaims } = <IdTokenClaims>req.session.account.idTokenClaims;

        const silentRequest: SilentFlowRequest = {
            account: req.session.account,
            scopes: AccessControlConstants.GRAPH_MEMBER_SCOPES.split(" "),
        };

        try {
            // acquire token silently to be used in resource call
            const tokenResponse = await this.msalClient.acquireTokenSilent(silentRequest);
            try {
                const graphResponse = await FetchManager.callApiEndpointWithToken(AccessControlConstants.GRAPH_MEMBERS_ENDPOINT, tokenResponse.accessToken);

                /**
                 * Some queries against Microsoft Graph return multiple pages of data either due to server-side paging 
                 * or due to the use of the $top query parameter to specifically limit the page size in a request. 
                 * When a result set spans multiple pages, Microsoft Graph returns an @odata.nextLink property in 
                 * the response that contains a URL to the next page of results. Learn more at https://docs.microsoft.com/graph/paging
                 */
                if (graphResponse[AccessControlConstants.PAGINATION_LINK]) {
                    try {
                        const userGroups = await FetchManager.handlePagination(tokenResponse.accessToken, graphResponse[AccessControlConstants.PAGINATION_LINK]);

                        req.session.account.idTokenClaims = {
                            ...newIdTokenClaims,
                            groups: userGroups
                        }

                        if (!this.checkAccessRule(req.method, rule, req.session.account.idTokenClaims[AccessControlConstants.GROUPS], AccessControlConstants.GROUPS)) {
                            return res.redirect(this.appSettings.authRoutes.unauthorized);
                        } else {
                            return next();
                        }
                    } catch (error) {
                        next(error);
                    }
                } else {
                    req.session.account.idTokenClaims = {
                        ...newIdTokenClaims,
                        groups: graphResponse["value"].map((v) => v.id)
                    }

                    if (!this.checkAccessRule(req.method, rule, req.session.account.idTokenClaims[AccessControlConstants.GROUPS], AccessControlConstants.GROUPS)) {
                        return res.redirect(this.appSettings.authRoutes.unauthorized);
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
    };

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
                    if (rule.groups.filter(elem => creds.includes(elem)).length < 1) {
                        this.logger.error(ErrorMessages.USER_NOT_IN_GROUP);
                        return false;
                    }
                    break;

                case AccessControlConstants.ROLES:
                    if (rule.roles.filter(elem => creds.includes(elem)).length < 1) {
                        this.logger.error(ErrorMessages.USER_NOT_IN_ROLE);
                        return false;
                    }
                    break;

                default:
                    break;
            }
        } else {
            this.logger.error(ErrorMessages.METHOD_NOT_ALLOWED);
            return false;
        }

        return true;
    }
}
