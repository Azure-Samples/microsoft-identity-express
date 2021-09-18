import { Configuration } from "@azure/msal-node";

import { AppSettings, ClientCertificate, KeyVaultCredential } from "../config/AppSettings";
import { ConfigHelper } from "../config/ConfigHelper";
import { MsalMiddleware } from "./MsalMiddleware";
import { IDistributedPersistence } from "../cache/IDistributedPersistence";
import { KeyVaultManager } from "../network/KeyVaultManager";
import { MsalConfiguration } from "../config/MsalConfiguration";

export class MiddlewareBuilder {

    appSettings: AppSettings;
    private _msalConfig: Configuration;
    private _persistenceManager: IDistributedPersistence;
    private _keyVaultCredential: KeyVaultCredential;

    constructor(appSettings: AppSettings) {
        ConfigHelper.validateAppSettings(appSettings);
        this.appSettings = appSettings;
    };


    withKeyVaultCredentials(keyVaultCredential: KeyVaultCredential): MiddlewareBuilder {
        this._keyVaultCredential = keyVaultCredential;
        return this;
    }

    withDistributedTokenCache(persistenceManager: IDistributedPersistence): MiddlewareBuilder {
        this._persistenceManager = persistenceManager;
        return this;
    }

    /**
     * Synchronously builds the MSAL middleware with the provided configuration.
     * @returns {MsalMiddleware}
     */
    build(): MsalMiddleware {
        this._msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings, this._persistenceManager);
        return new MsalMiddleware(this.appSettings, this._msalConfig);
    }

    /**
     * Asynchronously builds the MSAL middleware with the provided configuration.
     * @returns {Promise}
     */
    async buildAsync(): Promise<MsalMiddleware> {
        try {

            if (this._keyVaultCredential) {
                const keyVaultManager = new KeyVaultManager();
                const credential = await keyVaultManager.getCredentialFromKeyVault(this._keyVaultCredential);
                this.appSettings.appCredentials[credential.type] = credential.value;
            }

            if (this._persistenceManager) {
                this._msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings, this._persistenceManager);
            } else {
                this._msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings);
            }

            return new MsalMiddleware(this.appSettings, this._msalConfig);
        } catch (error) {
            throw new Error(error);
        }
    }
}