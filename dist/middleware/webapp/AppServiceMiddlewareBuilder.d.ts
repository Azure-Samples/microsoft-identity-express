import { BaseMiddlewareBuilder } from "../BaseMiddlewareBuilder";
import { AppServiceAuthMiddleware } from "./AppServiceAuthMiddleware";
import { AppSettings } from "../../config/AppSettings";
export declare class AppServiceMiddlewareBuilder extends BaseMiddlewareBuilder {
    appSettings: AppSettings;
    private msalConfig;
    constructor(appSettings: AppSettings);
    /**
     * Synchronously builds the MSAL middleware with the provided configuration.
     * @returns {AppServiceAuthMiddleware}
     */
    build(): AppServiceAuthMiddleware;
    /**
     * Asynchronously builds the MSAL middleware with the provided configuration.
     * @returns {Promise}
     */
    buildAsync(): Promise<AppServiceAuthMiddleware>;
}
