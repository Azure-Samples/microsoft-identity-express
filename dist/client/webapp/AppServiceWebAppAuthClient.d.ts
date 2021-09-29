import { Router, RequestHandler } from "express";
import { BaseAuthClient } from "../BaseAuthClient";
import { Configuration } from "@azure/msal-node";
import { AppSettings } from "../../config/AppSettings";
import { GuardOptions, InitializationOptions, SignInOptions, SignOutOptions, TokenRequestOptions } from "../MiddlewareOptions";
export declare class AppServiceWebAppAuthClient extends BaseAuthClient {
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
    private handleRedirect;
    /**
     * Middleware that gets tokens
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getToken(options: TokenRequestOptions): RequestHandler;
    /**
     * Check if authenticated in session
     * @param {GuardOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    isAuthenticated(options?: GuardOptions): RequestHandler;
}
