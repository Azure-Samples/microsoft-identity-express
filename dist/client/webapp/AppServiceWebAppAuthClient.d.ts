import { Router, RequestHandler } from 'express';
import { Configuration } from '@azure/msal-node';
import { BaseAuthClient } from '../BaseAuthClient';
import { AppSettings, WebAppSettings } from '../../config/AppSettings';
import { SignInOptions, SignOutOptions, TokenRequestOptions } from '../MiddlewareOptions';
export declare class AppServiceWebAppAuthClient extends BaseAuthClient {
    webAppSettings: WebAppSettings;
    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration);
    /**
     * Initialize AuthProvider and set default routes and handlers
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    initialize(): Router;
    /**
     * Initiates sign in flow
     * @param {SignInOptions} options: options to modify login request
     * @returns {RequestHandler}
     */
    signIn(options?: SignInOptions): RequestHandler;
    /**
     * Initiate sign out and destroy the session
     * @param {SignOutOptions} options: options to modify logout request
     * @returns {RequestHandler}
     */
    signOut(options?: SignOutOptions): RequestHandler;
    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @returns {RequestHandler}
     */
    private handleRedirect;
    /**
     * Middleware that gets tokens
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getToken(options: TokenRequestOptions): RequestHandler;
    /**
     * Check if authenticated in session
     * @returns {RequestHandler}
     */
    isAuthenticated(): RequestHandler;
}
