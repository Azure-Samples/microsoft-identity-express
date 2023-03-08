/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Logger, LoggerOptions, LogLevel } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration, CryptoProvider } from "@azure/msal-node";

import { AppSettings } from "../config/AppSettings";
import { CryptoUtils } from "../utils/CryptoUtils";
import { packageName, packageVersion } from "../packageMetadata";

export abstract class BaseAuthClient {
    appSettings: AppSettings;

    protected msalConfig: Configuration;
    protected msalClient: ConfidentialClientApplication;
    protected cryptoProvider: CryptoProvider;
    protected cryptoUtils: CryptoUtils;
    protected logger: Logger;
    protected loggerOptions: LoggerOptions;

    protected constructor(appSettings: AppSettings, msalConfig: Configuration) {
        this.appSettings = appSettings;
        this.msalConfig = msalConfig;
        this.cryptoProvider = new CryptoProvider();
        this.cryptoUtils = new CryptoUtils();
        this.loggerOptions =
            this.msalConfig.system && this.msalConfig.system.loggerOptions
                ? this.msalConfig.system.loggerOptions
                : this.createDefaultLoggerOptions();

        this.logger = new Logger(this.loggerOptions, packageName, packageVersion);
        this.msalClient = new ConfidentialClientApplication(this.msalConfig);
    }

    getMsalClient(): ConfidentialClientApplication {
        return this.msalClient;
    }

    getMsalConfig(): Configuration {
        return this.msalConfig;
    }

    getLogger(): Logger {
        return this.logger;
    }

    createDefaultLoggerOptions(): LoggerOptions {
        return {
            loggerCallback: () => {
                // allow users to not set loggerCallback
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Info,
        }; 
    }
}
