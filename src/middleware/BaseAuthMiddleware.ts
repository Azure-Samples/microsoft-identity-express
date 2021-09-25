/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Router } from "express";

import { Logger } from "@azure/msal-common";
import {
    ConfidentialClientApplication,
    Configuration,
} from "@azure/msal-node";

import { TokenValidator } from "../crypto/TokenValidator";
import { AppSettings } from "../config/AppSettings";
import { InitializationOptions } from "./MiddlewareOptions";

import {
    packageName,
    packageVersion
} from "../packageMetadata";

export abstract class BaseAuthMiddleware {

    appSettings: AppSettings;
    protected msalConfig: Configuration;
    protected msalClient: ConfidentialClientApplication;
    protected tokenValidator: TokenValidator;
    protected logger: Logger;

    protected constructor(appSettings: AppSettings, msalConfig: Configuration) {
        this.appSettings = appSettings;
        this.msalConfig = msalConfig;
        this.tokenValidator = new TokenValidator(this.appSettings, this.msalConfig, this.logger);
        this.logger = new Logger(this.msalConfig.system.loggerOptions, packageName, packageVersion);
        this.msalClient = new ConfidentialClientApplication(this.msalConfig);
    }

    /**
     * Initialize AuthProvider and set default routes and handlers
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    abstract initialize(options: InitializationOptions): Router;

    getMsalClient(): ConfidentialClientApplication {
        return this.msalClient;
    }

    getLogger(): Logger {
        return this.logger;
    }

    /**
     * Replaces the default logger set in configurations with new Logger with new configurations
     * @param {Logger} logger - Logger instance
     */
    setLogger(logger: Logger): void {
        this.logger = logger;
    }

    /**
     * Gets the token cache for the application.
     */
    // getTokenCache(): TokenCache {
    //     this.logger.info("getTokenCache called");
    //     return this.tokenCache;
    // }
}