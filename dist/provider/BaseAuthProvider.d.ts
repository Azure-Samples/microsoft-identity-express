import { Logger } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration, CryptoProvider } from "@azure/msal-node";
import { AppSettings } from "../config/AppSettingsTypes";
export declare abstract class BaseAuthProvider {
    protected appSettings: AppSettings;
    protected msalConfig: Configuration;
    protected cryptoProvider: CryptoProvider;
    protected logger: Logger;
    protected constructor(appSettings: AppSettings, msalConfig: Configuration);
    getAppSettings(): AppSettings;
    getMsalConfig(): Configuration;
    getMsalClient(): ConfidentialClientApplication;
    getCryptoProvider(): CryptoProvider;
    getLogger(): Logger;
}
