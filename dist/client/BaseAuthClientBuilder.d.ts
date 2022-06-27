import { ICachePlugin } from '@azure/msal-node';
import { AppSettings, AppType, KeyVaultCredential } from '../config/AppSettings';
export declare abstract class BaseAuthClientBuilder {
    appSettings: AppSettings;
    protected keyVaultCredential: KeyVaultCredential | undefined;
    protected customCachePlugin: ICachePlugin | undefined;
    protected constructor(appSettings: AppSettings, appType: AppType);
    withKeyVaultCredentials(keyVaultCredential: KeyVaultCredential): BaseAuthClientBuilder;
    withCustomCachePlugin(cachePlugin: ICachePlugin): BaseAuthClientBuilder;
    abstract build(): any;
    abstract buildAsync(): Promise<any>;
}
