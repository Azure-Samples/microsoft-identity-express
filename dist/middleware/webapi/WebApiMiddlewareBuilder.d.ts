import { BaseMiddlewareBuilder } from "../BaseMiddlewareBuilder";
import { WebApiAuthMiddleware } from "./WebApiAuthMiddleware";
import { AppSettings } from "../../config/AppSettings";
export declare class WebApiMiddlewareBuilder extends BaseMiddlewareBuilder {
    appSettings: AppSettings;
    private msalConfig;
    constructor(appSettings: AppSettings);
    /**
     * Synchronously builds the MSAL middleware with the provided configuration.
     * @returns {WebApiAuthMiddleware}
     */
    build(): WebApiAuthMiddleware;
    /**
     * Asynchronously builds the MSAL middleware with the provided configuration.
     * @returns {Promise}
     */
    buildAsync(): Promise<WebApiAuthMiddleware>;
}
