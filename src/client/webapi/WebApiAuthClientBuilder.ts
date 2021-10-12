/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Configuration } from "@azure/msal-node";

import { BaseAuthClientBuilder } from "../BaseAuthClientBuilder";
import { MsalWebApiAuthClient } from "./MsalWebApiAuthClient";
import { KeyVaultManager } from "../../network/KeyVaultManager";
import { MsalConfiguration } from "../../config/MsalConfiguration";
import { AppSettings } from "../../config/AppSettings";

export class WebApiAuthClientBuilder extends BaseAuthClientBuilder {

    appSettings: AppSettings;
    private msalConfig: Configuration;

    constructor(appSettings: AppSettings) {
        super(appSettings)
    };

    /**
     * Synchronously builds the MSAL middleware with the provided configuration.
     * @returns {MsalWebApiAuthClient}
     */
    build(): MsalWebApiAuthClient {
        // TODO: throw error if key vault credential is being built
        this.msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings, this.persistenceManager);
        return new MsalWebApiAuthClient(this.appSettings, this.msalConfig);
    }

    /**
     * Asynchronously builds the MSAL middleware with the provided configuration.
     * @returns {Promise}
     */
    async buildAsync(): Promise<MsalWebApiAuthClient> {
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

            return new MsalWebApiAuthClient(this.appSettings, this.msalConfig);
        } catch (error) {
            throw new Error(error);
        }
    }
}