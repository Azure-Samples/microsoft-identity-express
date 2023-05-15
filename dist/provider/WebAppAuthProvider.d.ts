import { BaseAuthProvider } from "./BaseAuthProvider";
import { AppSettings, WebAppSettings } from "../config/AppSettingsTypes";
import { RequestHandler, ErrorRequestHandler } from "../middleware/MiddlewareTypes";
import { AuthenticateMiddlewareOptions, RouteGuardOptions } from "../middleware/MiddlewareOptions";
/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express web apps
 */
export declare class WebAppAuthProvider extends BaseAuthProvider {
    webAppSettings: WebAppSettings;
    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @constructor
     */
    private constructor();
    /**
     * Static method to async initialize WebAppAuthProvider
     * @param {AuthenticateMiddlewareOptions} appSettings: configuration object
     * @returns {Promise<WebAppAuthProvider>}
     */
    static initialize(appSettings: AppSettings): Promise<WebAppAuthProvider>;
    /**
     * Sets request context, default routes and handlers
     * @param {AuthenticateMiddlewareOptions} options: options to modify login request
     * @returns {Router}
     */
    authenticate(options?: AuthenticateMiddlewareOptions): RequestHandler;
    guard(options: RouteGuardOptions): RequestHandler;
    interactionErrorHandler(): ErrorRequestHandler;
}
