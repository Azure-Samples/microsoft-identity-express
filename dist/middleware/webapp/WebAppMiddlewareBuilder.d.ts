import { BaseMiddlewareBuilder } from "../BaseMiddlewareBuilder";
import { WebAppAuthMiddleware } from "./WebAppAuthMiddleware";
import { AppSettings } from "../../config/AppSettings";
export declare class WebAppMiddlewareBuilder extends BaseMiddlewareBuilder {
    appSettings: AppSettings;
    private msalConfig;
    constructor(appSettings: AppSettings);
    /**
     * Synchronously builds the MSAL middleware with the provided configuration.
     * @returns {WebAppAuthMiddleware}
     */
    build(): WebAppAuthMiddleware;
    /**
     * Asynchronously builds the MSAL middleware with the provided configuration.
     * @returns {Promise}
     */
    buildAsync(): Promise<WebAppAuthMiddleware>;
}
