import { Request, Response, NextFunction, Router } from "express";
import { ConfidentialClientApplication, Configuration, ICachePlugin, CryptoProvider } from "@azure/msal-node";
import { TokenValidator } from "./TokenValidator";
import { UrlUtils } from "./UrlUtils";
import { AppSettings, InitializationOptions } from "./Types";
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
export declare class AuthProvider {
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
    constructor(appSettings: AppSettings, cache?: ICachePlugin);
    initialize: (options?: InitializationOptions) => Router;
    /**
     * Initiate sign in flow
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     */
    signIn: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Initiate sign out and clean the session
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     */
    signOut: (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     */
    handleRedirect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Middleware that gets tokens via acquireToken*
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    getToken: (options?: any) => Function;
    /**
     * Middleware that gets tokens via OBO flow
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    getTokenOnBehalf: (options?: any) => Function;
    /**
     * Check if authenticated in session
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    isAuthenticated: (options?: any) => Function;
    /**
     * Receives access token in req authorization header
     * and validates it using the jwt.verify
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    isAuthorized: (options?: any) => Function;
    /**
     * Checks if the user has access for this route, defined in appSettings
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next
     */
    hasAccess: (options?: any) => Function;
    /**
     * This method is used to generate an auth code request
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @param {AuthCodeParams} params: modifies auth code request url
     */
    private getAuthCode;
    /**
     * Util method to get the resource name for a given callingPageRoute (appSettings.json)
     * @param {string} path: /path string that the resource is associated with
     */
    private getResourceName;
    /**
     * Util method to get the service name for a given endpoint (appSettings.json)
     * @param {string} path: /path string that the resource is associated with
     */
    private getServiceName;
}
