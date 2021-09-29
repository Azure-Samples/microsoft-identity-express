/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Logger } from "@azure/msal-common";

import {
    ConfidentialClientApplication,
    Configuration,
    CryptoProvider,
} from "@azure/msal-node";

import { TokenValidator } from "../crypto/TokenValidator";
import { AppSettings } from "../config/AppSettings";

import {
    packageName,
    packageVersion
} from "../packageMetadata";

export abstract class BaseAuthClient {

    appSettings: AppSettings;
    protected msalConfig: Configuration;
    protected msalClient: ConfidentialClientApplication;
    protected tokenValidator: TokenValidator;
    protected cryptoProvider: CryptoProvider;
    protected logger: Logger;

    protected constructor(appSettings: AppSettings, msalConfig: Configuration) {
        this.appSettings = appSettings;
        this.msalConfig = msalConfig;
        this.tokenValidator = new TokenValidator(this.appSettings, this.msalConfig, this.logger);
        this.cryptoProvider = new CryptoProvider();
        this.logger = new Logger(this.msalConfig.system.loggerOptions, packageName, packageVersion);
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
}