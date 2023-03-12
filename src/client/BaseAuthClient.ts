/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Logger, LoggerOptions } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration, CryptoProvider } from "@azure/msal-node";

import { AppSettings } from "../config/AppSettings";
import { CryptoUtils } from "../utils/CryptoUtils";
import { packageName, packageVersion } from "../packageMetadata";
import { DEFAULT_LOGGER_OPTIONS } from "../utils/Constants";

export abstract class BaseAuthClient {
    appSettings: AppSettings;

    protected msalConfig: Configuration;
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
                : DEFAULT_LOGGER_OPTIONS;

        this.logger = new Logger(this.loggerOptions, packageName, packageVersion);
    }

    getMsalInstance(): ConfidentialClientApplication {
        return new ConfidentialClientApplication(this.msalConfig);
    }

    getMsalConfig(): Configuration {
        return this.msalConfig;
    }

    getLogger(): Logger {
        return this.logger;
    }
}
