/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Logger } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration, CryptoProvider } from "@azure/msal-node";
import { AppSettings } from "../config/AppSettingsTypes";
import { DEFAULT_LOGGER_OPTIONS } from "../utils/Constants";
import { packageName, packageVersion } from "../packageMetadata";

export abstract class BaseAuthProvider {
    protected appSettings: AppSettings;
    protected msalConfig: Configuration;
    protected logger: Logger;

    protected constructor(appSettings: AppSettings, msalConfig: Configuration) {
        this.appSettings = appSettings;
        this.msalConfig = msalConfig;
        this.logger = new Logger(
            this.msalConfig.system?.loggerOptions || DEFAULT_LOGGER_OPTIONS,
            packageName,
            packageVersion
        );
    }

    getAppSettings(): AppSettings {
        return this.appSettings;
    }

    getMsalConfig(): Configuration {
        return this.msalConfig;
    }

    getMsalClient(): ConfidentialClientApplication {
        return new ConfidentialClientApplication(this.msalConfig);
    }

    getCryptoProvider(): CryptoProvider {
        return new CryptoProvider();
    }

    getLogger(): Logger {
        return this.logger.clone(packageName, packageVersion);
    }
}
