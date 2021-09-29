import { BaseAuthClientBuilder } from "../BaseAuthClientBuilder";
import { MsalWebApiAuthClient } from "./MsalWebApiAuthClient";
import { AppSettings } from "../../config/AppSettings";
export declare class WebApiAuthClientBuilder extends BaseAuthClientBuilder {
    appSettings: AppSettings;
    private msalConfig;
    constructor(appSettings: AppSettings);
    /**
     * Synchronously builds the MSAL middleware with the provided configuration.
     * @returns {MsalWebApiAuthClient}
     */
    build(): MsalWebApiAuthClient;
    /**
     * Asynchronously builds the MSAL middleware with the provided configuration.
     * @returns {Promise}
     */
    buildAsync(): Promise<MsalWebApiAuthClient>;
}
