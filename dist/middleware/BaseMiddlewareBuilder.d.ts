import { ICachePlugin } from "@azure/msal-node";
import { IDistributedPersistence } from "../cache/IDistributedPersistence";
import { AppSettings, KeyVaultCredential } from "../config/AppSettings";
export declare abstract class BaseMiddlewareBuilder {
    appSettings: AppSettings;
    protected persistenceManager: IDistributedPersistence;
    protected keyVaultCredential: KeyVaultCredential;
    protected customCachePlugin: ICachePlugin;
    protected constructor(appSettings: AppSettings);
    withKeyVaultCredentials(keyVaultCredential: KeyVaultCredential): BaseMiddlewareBuilder;
    withDistributedTokenCache(persistenceManager: IDistributedPersistence): BaseMiddlewareBuilder;
    withCustomCachePlugin(cachePlugin: ICachePlugin): BaseMiddlewareBuilder;
    abstract build(): any;
    abstract buildAsync(): Promise<any>;
}
