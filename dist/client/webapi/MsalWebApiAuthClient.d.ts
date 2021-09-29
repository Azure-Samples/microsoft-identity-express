import { RequestHandler, Router } from "express";
import { Configuration } from "@azure/msal-node";
import { BaseAuthClient } from "../BaseAuthClient";
import { AppSettings } from "../../config/AppSettings";
import { InitializationOptions, TokenRequestOptions, GuardOptions } from "../MiddlewareOptions";
/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in RESTful APIs.
 */
export declare class MsalWebApiAuthClient extends BaseAuthClient {
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
     * Middleware that gets tokens via OBO flow. Used in web API scenarios
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getTokenOnBehalf(options: TokenRequestOptions): RequestHandler;
    /**
     * Receives access token in req authorization header
     * and validates it using the jwt.verify
     * @param {GuardOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    isAuthorized(options?: GuardOptions): RequestHandler;
}
