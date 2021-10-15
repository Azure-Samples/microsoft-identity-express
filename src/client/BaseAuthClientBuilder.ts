/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ICachePlugin } from "@azure/msal-node";

import { IDistributedPersistence } from "../cache/IDistributedPersistence";
import { ConfigHelper } from "../config/ConfigHelper";
import { AppSettings, KeyVaultCredential } from "../config/AppSettings";

export abstract class BaseAuthClientBuilder {

    appSettings: AppSettings;
    protected persistenceManager: IDistributedPersistence;
    protected keyVaultCredential: KeyVaultCredential;
    protected customCachePlugin: ICachePlugin;

    protected constructor(appSettings: AppSettings) {
        ConfigHelper.validateAppSettings(appSettings);
        this.appSettings = appSettings;
    };

    withKeyVaultCredentials(keyVaultCredential: KeyVaultCredential): BaseAuthClientBuilder {
        this.keyVaultCredential = keyVaultCredential;
        return this;
    }

    withCustomCachePlugin(cachePlugin: ICachePlugin): BaseAuthClientBuilder {
        this.customCachePlugin = cachePlugin;
        return this;
    }
    
    withDistributedTokenCache(persistenceManager: IDistributedPersistence): BaseAuthClientBuilder {
        this.persistenceManager = persistenceManager;
        return this;
    }

    abstract build(): any;

    abstract buildAsync(): Promise<any>;
}