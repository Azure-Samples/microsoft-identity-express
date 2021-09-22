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
    abstract initialize(options: InitializationOptions): Router;
    getMsalClient(): ConfidentialClientApplication;
    getLogger(): Logger;
}
