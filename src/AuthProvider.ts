/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import express from "express";
import { Request, Response, NextFunction, Router } from "express";

import {
    InteractionRequiredAuthError,
    OIDC_DEFAULT_SCOPES,
    PromptValue,
    StringUtils,
} from "@azure/msal-common";

import {
    ConfidentialClientApplication,
    Configuration,
    AccountInfo,
    ICachePlugin,
    CryptoProvider,
    AuthorizationUrlRequest,
    AuthorizationCodeRequest,
    SilentFlowRequest,
} from "@azure/msal-node";

import { ConfigurationUtils } from "./ConfigurationUtils";
import { TokenValidator } from "./TokenValidator";
import { UrlUtils } from "./UrlUtils";

import {
    Resource,
    AppSettings,
    AuthCodeParams,
    AccessRule,
    Service,
    InitializationOptions
} from "./Types";

import {
    AppStages,
    ErrorMessages
} from "./Constants";

/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express MVC web apps.
 *
 * You must have express and express-sessions package installed. Middleware
 * here can be used with express sessions in route controllers.
 *
 * Session variables accessible are as follows:
 * req.session.isAuthenticated: boolean
 * req.session.isAuthorized: boolean
 * req.session.account: AccountInfo
 * req.session.<resourceName>.accessToken: string
 */
export class AuthProvider {
    urlUtils: UrlUtils;
    appSettings: AppSettings;
    msalConfig: Configuration;
    cryptoProvider: CryptoProvider;
    tokenValidator: TokenValidator;
    msalClient: ConfidentialClientApplication;

    /**
     * @param {AppSettings} appSettings
     * @param {ICachePlugin} cache: cachePlugin
     */
    constructor(appSettings: AppSettings, cache?: ICachePlugin) {
        ConfigurationUtils.validateAppSettings(appSettings);
        this.appSettings = appSettings;

        this.msalConfig = ConfigurationUtils.getMsalConfiguration(appSettings, cache);
        this.msalClient = new ConfidentialClientApplication(this.msalConfig);

        this.tokenValidator = new TokenValidator(this.appSettings, this.msalConfig);
        this.cryptoProvider = new CryptoProvider();
        this.urlUtils = new UrlUtils();
    }

    initialize = (options?: InitializationOptions): Router => {

        // TODO: takex in login routes
        const appRouter = express.Router();

        // authentication routes
        appRouter.get('/signin', this.signIn);
        appRouter.get('/signout', this.signOut);
        appRouter.get('/redirect', this.handleRedirect);

        return appRouter;
    }

    // ========== HANDLERS ===========

    /**
     * Initiate sign in flow
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     */
    signIn = (req: Request, res: Response, next: NextFunction): void => {
        /**
         * Request Configuration
         * We manipulate these three request objects below
         * to acquire a token with the appropriate claims
         */
        if (!req.session["authCodeRequest"]) {
            req.session.authCodeRequest = {
                authority: "",
                scopes: [],
                state: {},
                redirectUri: "",
            } as AuthorizationUrlRequest;
        }

        if (!req.session["tokenRequest"]) {
            req.session.tokenRequest = {
                authority: "",
                scopes: [],
                redirectUri: "",
                code: "",
            } as AuthorizationCodeRequest;
        }

        // signed-in user"s account
        if (!req.session["account"]) {
            req.session.account = {
                homeAccountId: "",
                environment: "",
                tenantId: "",
                username: "",
                idTokenClaims: {},
            } as AccountInfo;
        }

        // random GUID for csrf protection
        req.session.nonce = this.cryptoProvider.createNewGuid();

        const state = this.cryptoProvider.base64Encode(
            JSON.stringify({
                stage: AppStages.SIGN_IN,
                path: req.route.path,
                nonce: req.session.nonce,
            })
        );

        const params: AuthCodeParams = {
            authority: this.msalConfig.auth.authority,
            scopes: OIDC_DEFAULT_SCOPES,
            state: state,
            redirect: this.appSettings.settings.redirectUri,
            prompt: PromptValue.SELECT_ACCOUNT,
        };

        // get url to sign user in
        this.getAuthCode(req, res, next, params);
    };

    /**
     * Initiate sign out and clean the session
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     */
    signOut = (req: Request, res: Response, next: NextFunction): void => {
        const postLogoutRedirectUri = this.urlUtils.ensureAbsoluteUrl(req, this.appSettings.settings.postLogoutRedirectUri);

        /**
         * Construct a logout URI and redirect the user to end the
         * session with Azure AD/B2C. For more information, visit:
         * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
         * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
         */
        const logoutURI = `${this.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`;

        req.session.isAuthenticated = false;

        req.session.destroy(() => {
            res.redirect(logoutURI);
        });
    };

    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     */
    handleRedirect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (req.query.state) {
            const state = JSON.parse(this.cryptoProvider.base64Decode(req.query.state as string));

            // check if nonce matches
            if (state.nonce === req.session.nonce) {
                switch (state.stage) {
                    case AppStages.SIGN_IN: {
                        // token request should have auth code
                        const tokenRequest: AuthorizationCodeRequest = {
                            redirectUri: this.urlUtils.ensureAbsoluteUrl(req, this.appSettings.settings.redirectUri),
                            scopes: OIDC_DEFAULT_SCOPES,
                            code: req.query.code as string,
                        };

                        try {
                            // exchange auth code for tokens
                            const tokenResponse = await this.msalClient.acquireTokenByCode(tokenRequest);
                            console.log("\nResponse: \n:", tokenResponse);

                            try {
                                const isIdTokenValid = await this.tokenValidator.validateIdToken(tokenResponse.idToken);

                                if (isIdTokenValid) {
                                    // assign session variables
                                    req.session.account = tokenResponse.account;
                                    req.session.isAuthenticated = true;

                                    res.status(200).redirect(this.appSettings.settings.homePageRoute);
                                } else {
                                    console.log(ErrorMessages.INVALID_TOKEN);
                                    res.status(401).send(ErrorMessages.NOT_PERMITTED);
                                }
                            } catch (error) {
                                console.log(error);
                                res.status(500).send(ErrorMessages.NOT_PERMITTED);
                            }
                        } catch (error) {
                            console.log(error);
                            res.status(500).send(ErrorMessages.TOKEN_ACQUISITION_FAILED);
                        }
                        break;
                    }

                    case AppStages.ACQUIRE_TOKEN: {
                        // get the name of the resource associated with scope
                        const resourceName = this.getResourceName(state.path);

                        const tokenRequest: AuthorizationCodeRequest = {
                            code: req.query.code as string,
                            scopes: this.appSettings.resources[resourceName].scopes, // scopes for resourceName
                            redirectUri: this.urlUtils.ensureAbsoluteUrl(req, this.appSettings.settings.redirectUri),
                        };

                        try {
                            const tokenResponse = await this.msalClient.acquireTokenByCode(tokenRequest);
                            console.log("\nResponse: \n:", tokenResponse);
                            req.session.resources[resourceName].accessToken = tokenResponse.accessToken;
                            res.status(200).redirect(state.path);
                        } catch (error) {
                            console.log(error);
                            res.status(500).send(ErrorMessages.TOKEN_ACQUISITION_FAILED);
                        }
                        break;
                    }

                    default:
                        res.status(500).send(ErrorMessages.CANNOT_DETERMINE_APP_STAGE);
                        break;
                }
            } else {
                console.log(ErrorMessages.NONCE_MISMATCH);
                res.status(401).send(ErrorMessages.NOT_PERMITTED);
            }
        } else {
            res.status(500).send(ErrorMessages.STATE_NOT_FOUND);
        }
    };

    // ========== MIDDLEWARE ===========

    /**
     * Middleware that gets tokens via acquireToken*
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    getToken = (options?): Function => {
        return async(req: Request, res: Response, next: NextFunction): Promise<void> => {
            // get scopes for token request
            const scopes = (Object.values(this.appSettings.resources)
                .find((resource: Resource) => resource.callingPageRoute === req.route.path) as Resource).scopes;

            const resourceName = this.getResourceName(req.route.path);

            if (!req.session[resourceName]) {
                req.session[resourceName] = {
                    accessToken: "",
                } as Resource;
            }

            try {
                const silentRequest: SilentFlowRequest = {
                    account: req.session.account,
                    scopes: scopes,
                };

                // acquire token silently to be used in resource call
                const tokenResponse = await this.msalClient.acquireTokenSilent(silentRequest);
                console.log("\nSuccessful silent token acquisition:\n Response: \n:", tokenResponse);

                // In B2C scenarios, sometimes an access token is returned empty.
                // In that case, we will acquire token interactively instead.
                if (StringUtils.isEmpty(tokenResponse.accessToken)) {
                    console.log(ErrorMessages.TOKEN_NOT_FOUND);
                    throw new InteractionRequiredAuthError(ErrorMessages.INTERACTION_REQUIRED);
                }

                req.session[resourceName].accessToken = tokenResponse.accessToken;
                next();
            } catch (error) {
                // in case there are no cached tokens, initiate an interactive call
                if (error instanceof InteractionRequiredAuthError) {
                    const state = this.cryptoProvider.base64Encode(
                        JSON.stringify({
                            stage: AppStages.ACQUIRE_TOKEN,
                            path: req.route.path,
                            nonce: req.session.nonce,
                        })
                    );

                    const params: AuthCodeParams = {
                        authority: this.msalConfig.auth.authority,
                        scopes: scopes,
                        state: state,
                        redirect: this.appSettings.settings.redirectUri,
                        account: req.session.account,
                    };

                    // initiate the first leg of auth code grant to get token
                    this.getAuthCode(req, res, next, params);
                }
            }
        }
    };

    /**
     * Middleware that gets tokens via OBO flow
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    getTokenOnBehalf = (options?): Function => {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const authHeader = req.headers.authorization;

            // get scopes for token request
            const scopes = (Object.values(this.appSettings.resources)
                .find((resource: Resource) => resource.callingPageRoute === req.route.path) as Resource).scopes;

            const oboRequest = {
                oboAssertion: authHeader.split(" ")[1],
                scopes: scopes,
            }

            // get the resource name for attaching resource response to req
            const serviceName = this.getServiceName(req.route.path);

            try {
                const tokenResponse = await this.msalClient.acquireTokenOnBehalfOf(oboRequest);

                if (req.session) {
                    req.session[serviceName]["accessToken"] = tokenResponse.accessToken;
                } else {
                    req["locals"] = {
                        serviceName: {
                            "accessToken": tokenResponse.accessToken
                        }
                    }
                }

                next();
            } catch (error) {
                console.log(error);
            }
        }
    }

    // ============== GUARDS ===============

    /**
     * Check if authenticated in session
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    isAuthenticated = (options?): Function => {
        return (req: Request, res: Response, next: NextFunction): void | Response => {
            if (req.session) {
                if (!req.session.isAuthenticated) {
                    return res.status(403).send(ErrorMessages.NOT_PERMITTED);
                }

                next();
            } else {
                res.status(401).send(ErrorMessages.NOT_PERMITTED);
            }
        }
    };

    /**
     * Receives access token in req authorization header
     * and validates it using the jwt.verify
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    isAuthorized = (options?): Function => {
        return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
            const accessToken = req.headers.authorization.split(" ")[1];

            if (req.headers.authorization) {
                if (!(await this.tokenValidator.validateAccessToken(accessToken, req.route.path))) {
                    return res.status(401).send(ErrorMessages.NOT_PERMITTED);
                }

                next();
            } else {
                res.status(401).send(ErrorMessages.NOT_PERMITTED);
            }
        }
    };

    /**
     * Checks if the user has access for this route, defined in appSettings
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    hasAccess = (options?): Function => {
        return (req: Request, res: Response, next: NextFunction): void | Response => {
            if (req.session && this.appSettings.accessMatrix) {
                if (req.session.account.idTokenClaims["roles"] === undefined) {
                    return res.status(403).send(ErrorMessages.USER_HAS_NO_ROLE);
                } else {
                    const roles = req.session.account.idTokenClaims["roles"];
                    const rule = Object.values(this.appSettings.accessMatrix)
                        .filter((rule: AccessRule) => rule.path === req.path);

                    if (rule.length < 1) {
                        return res.status(403).send(ErrorMessages.RULE_NOT_FOUND);
                    } else {
                        if (rule[0].methods.includes(req.method)) {
                            let intersection = rule[0].roles.filter(role => roles.includes(role));

                            if (intersection.length < 1) {
                                return res.status(403).send(ErrorMessages.USER_NOT_IN_ROLE);
                            }
                        } else {
                            return res.status(403).send(ErrorMessages.METHOD_NOT_ALLOWED)
                        }
                    }
                }

                next();
            } else {
                res.status(401).send(ErrorMessages.NOT_PERMITTED);
            }
        }
    }

    // ============== UTILS ===============

    /**
     * This method is used to generate an auth code request
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @param {AuthCodeParams} params: modifies auth code request url
     */
    private getAuthCode = async (req: Request, res: Response, next: NextFunction, params: AuthCodeParams): Promise<void> => {
        // prepare the request
        req.session.authCodeRequest.authority = params.authority;
        req.session.authCodeRequest.scopes = params.scopes;
        req.session.authCodeRequest.state = params.state;
        req.session.authCodeRequest.redirectUri = this.urlUtils.ensureAbsoluteUrl(req, params.redirect);
        req.session.authCodeRequest.prompt = params.prompt;
        req.session.authCodeRequest.account = params.account;

        req.session.tokenRequest.authority = params.authority;

        // request an authorization code to exchange for tokens
        try {
            const response = await this.msalClient.getAuthCodeUrl(req.session.authCodeRequest);
            res.redirect(response);
        } catch (error) {
            console.log(error);
            res.status(500).send(ErrorMessages.AUTH_CODE_NOT_OBTAINED);
        }
    };

    /**
     * Util method to get the resource name for a given callingPageRoute (appSettings.json)
     * @param {string} path: /path string that the resource is associated with
     */
    private getResourceName = (path: string): string => {
        const index = Object.values(this.appSettings.resources).findIndex((resource: Resource) => resource.callingPageRoute === path);
        const resourceName = Object.keys(this.appSettings.resources)[index];
        return resourceName;
    };

    /**
     * Util method to get the service name for a given endpoint (appSettings.json)
     * @param {string} path: /path string that the resource is associated with
     */
    private getServiceName = (path: string): string => {
        const index = Object.values(this.appSettings.services).findIndex((service: Service) => service.endpoint === path);
        const serviceName = Object.keys(this.appSettings.services)[index];
        return serviceName;
    };
}
