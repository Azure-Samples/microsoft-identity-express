/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Logger } from '@azure/msal-common';
import { ConfidentialClientApplication, Configuration, CryptoProvider } from '@azure/msal-node';

import { AppSettings } from '../config/AppSettings';
import { CryptoUtils } from '../utils/CryptoUtils';
import { packageName, packageVersion } from '../packageMetadata';

export abstract class BaseAuthClient {
    appSettings: AppSettings;

    protected msalConfig: Configuration;
    protected msalClient: ConfidentialClientApplication;
    protected cryptoProvider: CryptoProvider;
    protected cryptoUtils: CryptoUtils;
    protected logger: Logger;

    protected constructor(appSettings: AppSettings, msalConfig: Configuration) {
        this.appSettings = appSettings;
        this.msalConfig = msalConfig;
        this.cryptoProvider = new CryptoProvider();
        this.cryptoUtils = new CryptoUtils();

        this.logger = new Logger(this.msalConfig.system?.loggerOptions!, packageName, packageVersion);

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
