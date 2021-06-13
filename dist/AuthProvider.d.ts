import { RequestHandler, Router } from "express";
import { ConfidentialClientApplication, Configuration, ICachePlugin, CryptoProvider } from "@azure/msal-node";
import { TokenValidator } from "./TokenValidator";
import { AppSettings, InitializationOptions, TokenOptions, GuardOptions } from "./Types";
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
 * req.session.account: AccountInfo
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
     * Initialize authProvider and set default routes
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    initialize: (options?: InitializationOptions) => Router;
    /**
     * Initiate sign in flow
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @returns {void}
     */
    signIn: RequestHandler;
    /**
     * Initiate sign out and destroy the session
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @returns {void}
     */
    signOut: RequestHandler;
    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @returns {Promise}
     */
    handleRedirect: RequestHandler;
    /**
     * Middleware that gets tokens via acquireToken*
     * @param {TokenOptions} options: express request object
     * @returns {RequestHandler}
     */
    getToken: (options: TokenOptions) => RequestHandler;
    /**
     * Middleware that gets tokens via OBO flow. Used in api scenarios
     * @param {TokenOptions} options: express request object
     * @returns {RequestHandler}
     */
    getTokenOnBehalf: (options: TokenOptions) => RequestHandler;
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
     * @param {AuthCodeParams} params: modifies auth code request url
     * @returns {Promise}
     */
    private getAuthCode;
    /**
     *
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @returns
     */
    private handleOverage;
    private applyAccessRule;
    /**
     * Util method to get the resource name for a given scope(s)
     * @param {Array} scopes: /path string that the resource is associated with
     * @returns {string}
     */
    private getResourceNameFromScopes;
}
