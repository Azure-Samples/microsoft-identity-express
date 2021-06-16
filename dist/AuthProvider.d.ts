import { RequestHandler, Router } from "express";
import { ConfidentialClientApplication, Configuration, ICachePlugin, CryptoProvider } from "@azure/msal-node";
import { TokenValidator } from "./TokenValidator";
import { AppSettings, InitializationOptions, TokenRequestOptions, GuardOptions, LoginOptions, LogoutOptions } from "./Types";
/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express MVC web apps and
 * RESTful APIs.
 *
 * You must have express and express-sessions packages installed.
 * Session variables accessible are as follows:
 *
 * req.session.isAuthenticated: boolean
 *
 * req.session.account: AccountInfo
 *
 * req.session.remoteResources.{resourceName}.accessToken: string
 */
export declare class AuthProvider {
    appSettings: AppSettings;
    msalConfig: Configuration;
    cryptoProvider: CryptoProvider;
    tokenValidator: TokenValidator;
    msalClient: ConfidentialClientApplication;
    /**
     * @param {AppSettings} appSettings
     * @param {ICachePlugin} cache: cachePlugin
     * @constructor
     */
    constructor(appSettings: AppSettings, cache?: ICachePlugin);
    /**
     * Initialize AuthProvider and set default routes and handlers
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    initialize: (options?: InitializationOptions) => Router;
    /**
     * Initiates sign in flow
     * @param {LoginOptions} options: options to modify login request
     * @returns {RequestHandler}
     */
    login: (options?: LoginOptions) => RequestHandler;
    /**
     * Initiate sign out and destroy the session
     * @param options
     * @returns {RequestHandler}
     */
    logout: (options?: LogoutOptions) => RequestHandler;
    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @returns {RequestHandler}
     */
    private handleRedirect;
    /**
     * Middleware that gets tokens via acquireToken*
     * @param {TokenRequestOptions} options: express request object
     * @returns {RequestHandler}
     */
    getToken: (options: TokenRequestOptions) => RequestHandler;
    /**
     * Middleware that gets tokens via OBO flow. Used in api scenarios
     * @param {TokenRequestOptions} options: express request object
     * @returns {RequestHandler}
     */
    getTokenOnBehalf: (options: TokenRequestOptions) => RequestHandler;
    /**
     * Check if authenticated in session
     * @param {GuardOptions} options: express request object
     * @returns {RequestHandler}
     */
    isAuthenticated: (options?: GuardOptions) => RequestHandler;
    /**
     * Receives access token in req authorization header
     * and validates it using the jwt.verify
     * @param {GuardOptions} options: express request object
     * @returns {RequestHandler}
     */
    isAuthorized: (options?: GuardOptions) => RequestHandler;
    /**
     * Checks if the user has access for this route, defined in access matrix
     * @param {GuardOptions} options: express request object
     * @returns {RequestHandler}
     */
    hasAccess: (options?: GuardOptions) => RequestHandler;
    /**
     * This method is used to generate an auth code request
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @param {AuthCodeParams} params: modifies auth code url request
     * @returns {Promise}
     */
    private getAuthCode;
    /**
     *
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @param {AccessRule} rule: a given access rule
     * @returns
     */
    private handleOverage;
    /**
     * Checks if the request passes a given access rule
     * @param {string} method
     * @param {AccessRule} rule
     * @param {Array} creds
     * @param {string} credType
     * @returns {boolean}
     */
    private checkAccessRule;
    /**
     * Util method to get the resource name for a given scope(s)
     * @param {Array} scopes: an array of scopes that the resource is associated with
     * @returns {string}
     */
    private getResourceNameFromScopes;
}
