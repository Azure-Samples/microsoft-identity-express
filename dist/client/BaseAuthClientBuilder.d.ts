import { ICachePlugin } from "@azure/msal-node";
import { IDistributedPersistence } from "../cache/IDistributedPersistence";
import { AppSettings, KeyVaultCredential } from "../config/AppSettings";
export declare abstract class BaseAuthClientBuilder {
    appSettings: AppSettings;
    protected persistenceManager: IDistributedPersistence;
    protected keyVaultCredential: KeyVaultCredential;
    protected customCachePlugin: ICachePlugin;
    protected constructor(appSettings: AppSettings);
    withKeyVaultCredentials(keyVaultCredential: KeyVaultCredential): BaseAuthClientBuilder;
    withCustomCachePlugin(cachePlugin: ICachePlugin): BaseAuthClientBuilder;
    withDistributedTokenCache(persistenceManager: IDistributedPersistence): BaseAuthClientBuilder;
    abstract build(): any;
    abstract buildAsync(): Promise<any>;
}
