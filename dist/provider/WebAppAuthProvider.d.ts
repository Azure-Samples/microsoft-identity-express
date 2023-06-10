import { BaseAuthProvider } from "./BaseAuthProvider";
import { AppSettings, WebAppSettings } from "../config/AppSettingsTypes";
import { AuthenticateMiddlewareOptions, RouteGuardOptions } from "../middleware/MiddlewareOptions";
import { ErrorRequestHandler, RequestHandler } from "../middleware/MiddlewareTypes";
export declare class WebAppAuthProvider extends BaseAuthProvider {
    webAppSettings: WebAppSettings;
    private constructor();
    /**
     * Static method to async initialize WebAppAuthProvider
     * @param {AuthenticateMiddlewareOptions} appSettings: configuration object
     * @returns {Promise<WebAppAuthProvider>}
     */
    static initialize(appSettings: AppSettings): Promise<WebAppAuthProvider>;
    /**
     * Sets request context, default routes and handlers
     * @param {AuthenticateMiddlewareOptions} options: options to modify middleware behavior
     * @returns {RequestHandler}
     */
    authenticate(options?: AuthenticateMiddlewareOptions): RequestHandler;
    /**
     * Guards a specified route with given options
     * @param {RouteGuardOptions} options: options to modify middleware behavior
     * @returns {RequestHandler}
     */
    guard(options?: RouteGuardOptions): RequestHandler;
    /**
     * Middleware to handle interaction required errors
     * @returns {ErrorRequestHandler}
     */
    interactionErrorHandler(): ErrorRequestHandler;
}
