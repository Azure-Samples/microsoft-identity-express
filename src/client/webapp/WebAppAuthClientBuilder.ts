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
import { AppSettings, AppType } from "../../config/AppSettings";
import { EnvironmentUtils } from "../../utils/EnvironmentUtils";
import { KeyVaultCredentialTypes } from "../../utils/Constants";
import { FetchManager } from "../../network/FetchManager";

export class WebAppAuthClientBuilder extends BaseAuthClientBuilder {
    appSettings!: AppSettings;
    private msalConfig!: Configuration;

    constructor(appSettings: AppSettings) {
        super(appSettings, AppType.WebApp);
    }

    build(): MsalWebAppAuthClient | AppServiceWebAppAuthClient {
        if (this.keyVaultCredential) {
            throw new Error("Key Vault credentials cannot be used in a synchronous build.");
        }

        this.msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings);

        if (this.customCachePlugin) {
            this.msalConfig.cache = { cachePlugin: this.customCachePlugin };
        }

        if (EnvironmentUtils.isAppServiceAuthEnabled()) {
            return new AppServiceWebAppAuthClient(this.appSettings, this.msalConfig);
        } else {
            return new MsalWebAppAuthClient(this.appSettings, this.msalConfig);
        }
    }

    async buildAsync(): Promise<MsalWebAppAuthClient | AppServiceWebAppAuthClient> {
        try {
            this.msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings);

            if (this.keyVaultCredential) {
                const keyVaultManager = new KeyVaultManager();
                const credential = await keyVaultManager.getCredentialFromKeyVault(this.keyVaultCredential);

                switch (credential.type) {
                    case KeyVaultCredentialTypes.SECRET:
                        this.msalConfig.auth.clientSecret = credential.value;
                        break;
                    case KeyVaultCredentialTypes.CERTIFICATE:
                        this.msalConfig.auth.clientCertificate = credential.value;
                        break;
                }
            }

            if (this.customCachePlugin) {
                this.msalConfig.cache = { cachePlugin: this.customCachePlugin };
            }

            const [discoveryMetadata, authorityMetadata] = await Promise.all([
                FetchManager.fetchCloudDiscoveryMetadata(this.appSettings.appCredentials.tenantId),
                FetchManager.fetchAuthorityMetadata(this.appSettings.appCredentials.tenantId)
            ]);

            this.msalConfig.auth.cloudDiscoveryMetadata = discoveryMetadata;
            this.msalConfig.auth.authorityMetadata = authorityMetadata;

            if (EnvironmentUtils.isAppServiceAuthEnabled()) {
                return new AppServiceWebAppAuthClient(this.appSettings, this.msalConfig);
            } else {
                return new MsalWebAppAuthClient(this.appSettings, this.msalConfig);
            }
        } catch (error) {
            throw error;
        }
    }
}
