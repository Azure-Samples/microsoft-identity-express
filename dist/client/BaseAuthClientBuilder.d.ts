import { ICachePlugin } from "@azure/msal-node";
import { AppSettings, AppType, KeyVaultCredential } from "../config/AppSettings";
import { MsalWebAppAuthClient } from "./webapp/MsalWebAppAuthClient";
import { AppServiceWebAppAuthClient } from "./webapp/AppServiceWebAppAuthClient";
export declare abstract class BaseAuthClientBuilder {
    appSettings: AppSettings;
    protected keyVaultCredential: KeyVaultCredential | undefined;
    protected customCachePlugin: ICachePlugin | undefined;
    protected constructor(appSettings: AppSettings, appType: AppType);
    withKeyVaultCredentials(keyVaultCredential: KeyVaultCredential): BaseAuthClientBuilder;
    withCustomCachePlugin(cachePlugin: ICachePlugin): BaseAuthClientBuilder;
    abstract build(): MsalWebAppAuthClient | AppServiceWebAppAuthClient;
    abstract buildAsync(): Promise<MsalWebAppAuthClient | AppServiceWebAppAuthClient>;
}
