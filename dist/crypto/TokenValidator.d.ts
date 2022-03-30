import { Logger } from "@azure/msal-common";
import { Configuration } from "@azure/msal-node";
import { AuthToken } from "./AuthToken";
import { AppSettings } from "../config/AppSettings";
export declare class TokenValidator {
    logger: Logger;
    private appSettings;
    private msalConfig;
    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @param {Logger} logger
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration, logger: Logger);
    static decodeAuthToken(authToken: string): AuthToken;
}
