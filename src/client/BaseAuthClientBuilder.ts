/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ICachePlugin } from "@azure/msal-node";

import { ConfigHelper } from "../config/ConfigHelper";
import { AppSettings, AppType, KeyVaultCredential } from "../config/AppSettings";
import { MsalWebAppAuthClient } from "./webapp/MsalWebAppAuthClient";
import { AppServiceWebAppAuthClient } from "./webapp/AppServiceWebAppAuthClient";

export abstract class BaseAuthClientBuilder {
    appSettings: AppSettings;
    protected keyVaultCredential: KeyVaultCredential | undefined;
    protected customCachePlugin: ICachePlugin | undefined;

    protected constructor(appSettings: AppSettings, appType: AppType) {
        ConfigHelper.validateAppSettings(appSettings, appType);
        this.appSettings = appSettings;
    }

    withKeyVaultCredentials(keyVaultCredential: KeyVaultCredential): BaseAuthClientBuilder {
        this.keyVaultCredential = keyVaultCredential;
        return this;
    }

    withCustomCachePlugin(cachePlugin: ICachePlugin): BaseAuthClientBuilder {
        this.customCachePlugin = cachePlugin;
        return this;
    }

    abstract build(): MsalWebAppAuthClient | AppServiceWebAppAuthClient;

    abstract buildAsync(): Promise<MsalWebAppAuthClient | AppServiceWebAppAuthClient>;
}
