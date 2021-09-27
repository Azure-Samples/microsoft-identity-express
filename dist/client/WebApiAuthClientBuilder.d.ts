import { BaseAuthClientBuilder } from "./BaseAuthClientBuilder";
import { MsalWebApiAuthMiddleware } from "../middleware/MsalWebApiAuthMiddleware";
import { AppSettings } from "../config/AppSettings";
export declare class WebApiAuthClientBuilder extends BaseAuthClientBuilder {
    appSettings: AppSettings;
    private msalConfig;
    constructor(appSettings: AppSettings);
    /**
     * Synchronously builds the MSAL middleware with the provided configuration.
     * @returns {MsalWebApiAuthMiddleware}
     */
    build(): MsalWebApiAuthMiddleware;
    /**
     * Asynchronously builds the MSAL middleware with the provided configuration.
     * @returns {Promise}
     */
    buildAsync(): Promise<MsalWebApiAuthMiddleware>;
}
