/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Configuration } from "@azure/msal-node";

import { BaseAuthClientBuilder } from "../BaseAuthClientBuilder";
import { MsalWebAppAuthClient } from "./MsalWebAppAuthClient";
import { AppServiceWebAppAuthClient } from "./AppServiceWebAppAuthClient";
import { KeyVaultManager } from "../../network/KeyVaultManager";
import { MsalConfiguration } from "../../config/MsalConfiguration";
import { AppSettings } from "../../config/AppSettings";
import { EnvironmentUtils } from "../../utils/EnvironmentUtils";

export class WebAppAuthClientBuilder extends BaseAuthClientBuilder {

    appSettings: AppSettings;
    private msalConfig: Configuration;

    constructor(appSettings: AppSettings) {
        super(appSettings)
    };

    build(): MsalWebAppAuthClient | AppServiceWebAppAuthClient {
        // TODO: throw error if key vault credential is being built
        
        this.msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings, this.persistenceManager);
        
        if (EnvironmentUtils.isAppServiceAuthEnabled()) {
            return new AppServiceWebAppAuthClient(this.appSettings, this.msalConfig);
        } else {
            return new MsalWebAppAuthClient(this.appSettings, this.msalConfig);
        }
    }

    async buildAsync(): Promise<MsalWebAppAuthClient | AppServiceWebAppAuthClient> {
        try {
            if (this.keyVaultCredential) {
                const keyVaultManager = new KeyVaultManager();
                const credential = await keyVaultManager.getCredentialFromKeyVault(this.keyVaultCredential);
                this.appSettings.appCredentials[credential.type] = credential.value;
            }

            if (this.persistenceManager) {
                this.msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings, this.persistenceManager);
            } else {
                this.msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings);
            }

            if (EnvironmentUtils.isAppServiceAuthEnabled()) {
                return new AppServiceWebAppAuthClient(this.appSettings, this.msalConfig);
            } else {
                return new MsalWebAppAuthClient(this.appSettings, this.msalConfig);
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}