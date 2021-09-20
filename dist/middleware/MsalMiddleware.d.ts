import { RequestHandler, Router } from "express";
import { Configuration } from "@azure/msal-node";
import { IAuthMiddleware } from "./IAuthMiddleware";
import { AppSettings } from "../config/AppSettings";
import { InitializationOptions, TokenRequestOptions, GuardOptions, SignInOptions, SignOutOptions, HandleRedirectOptions } from "./MiddlewareOptions";
/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express MVC web apps and
 * RESTful APIs (coming soon).
 */
export declare class MsalMiddleware implements IAuthMiddleware {
    appSettings: AppSettings;
    private _msalConfig;
    private _msalClient;
    private _cryptoProvider;
    private _tokenValidator;
    private _logger;
    /**
     * @param {AppSettings} appSettings
     * @param {ICachePlugin} cache: cachePlugin
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration);
    /**
     * Initialize AuthProvider and set default routes and handlers
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    initialize(options?: InitializationOptions): Router;
    /**
     * Initiates sign in flow
     * @param {SignInOptions} options: options to modify login request
     * @returns {RequestHandler}
     */
    signIn(options?: SignInOptions): RequestHandler;
    /**
     * Initiate sign out and destroy the session
     * @param options: options to modify logout request
     * @returns {RequestHandler}
     */
    signOut(options?: SignOutOptions): RequestHandler;
    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @param {HandleRedirectOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    handleRedirect(options?: HandleRedirectOptions): RequestHandler;
    /**
     * Middleware that gets tokens via acquireToken*
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getToken(options: TokenRequestOptions): RequestHandler;
    /**
     * Middleware that gets tokens via OBO flow. Used in web API scenarios
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getTokenOnBehalf(options: TokenRequestOptions): RequestHandler;
    /**
     * Check if authenticated in session
     * @param {GuardOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    isAuthenticated(options?: GuardOptions): RequestHandler;
    /**
     * Receives access token in req authorization header
     * and validates it using the jwt.verify
     * @param {GuardOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    isAuthorized(options?: GuardOptions): RequestHandler;
    /**
     * Checks if the user has access for this route, defined in access matrix
     * @param {GuardOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    hasAccess(options?: GuardOptions): RequestHandler;
    /**
     * This method is used to generate an auth code url request
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @param {AuthCodeParams} params: modifies auth code url request
     * @returns {Promise}
     */
    private getAuthCode;
    /**
     * Checks if the request passes a given access rule
     * @param {string} method: HTTP method for this route
     * @param {AccessRule} rule: access rule for this route
     * @param {Array} creds: user's credentials i.e. roles or groups
     * @param {string} credType: roles or groups
     * @returns {boolean}
     */
    private checkAccessRule;
    /**
     * Handles group overage claims by querying MS Graph /memberOf endpoint
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @param {AccessRule} rule: a given access rule
     * @returns {Promise}
     */
    private handleOverage;
}
