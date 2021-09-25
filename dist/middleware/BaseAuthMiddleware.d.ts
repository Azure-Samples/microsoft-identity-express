import { Router } from "express";
import { Logger } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import { TokenValidator } from "../crypto/TokenValidator";
import { AppSettings } from "../config/AppSettings";
import { InitializationOptions } from "./MiddlewareOptions";
export declare abstract class BaseAuthMiddleware {
    appSettings: AppSettings;
    protected msalConfig: Configuration;
    protected msalClient: ConfidentialClientApplication;
    protected tokenValidator: TokenValidator;
    protected logger: Logger;
    protected constructor(appSettings: AppSettings, msalConfig: Configuration);
    /**
     * Initialize AuthProvider and set default routes and handlers
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    abstract initialize(options: InitializationOptions): Router;
    getMsalClient(): ConfidentialClientApplication;
    getLogger(): Logger;
    /**
     * Replaces the default logger set in configurations with new Logger with new configurations
     * @param {Logger} logger - Logger instance
     */
    setLogger(logger: Logger): void;
}
