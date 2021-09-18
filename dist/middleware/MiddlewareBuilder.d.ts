import { AppSettings, KeyVaultCredential } from "../config/AppSettings";
import { MsalMiddleware } from "./MsalMiddleware";
import { IDistributedPersistence } from "../cache/IDistributedPersistence";
export declare class MiddlewareBuilder {
    appSettings: AppSettings;
    private _msalConfig;
    private _persistenceManager;
    private _keyVaultCredential;
    constructor(appSettings: AppSettings);
    withKeyVaultCredentials(keyVaultCredential: KeyVaultCredential): MiddlewareBuilder;
    withDistributedTokenCache(persistenceManager: IDistributedPersistence): MiddlewareBuilder;
    /**
     * Synchronously builds the MSAL middleware with the provided configuration.
     * @returns {MsalMiddleware}
     */
    build(): MsalMiddleware;
    /**
     * Asynchronously builds the MSAL middleware with the provided configuration.
     * @returns {Promise}
     */
    buildAsync(): Promise<MsalMiddleware>;
}
