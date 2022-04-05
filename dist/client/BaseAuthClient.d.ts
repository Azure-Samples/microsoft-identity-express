import { Logger } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration, CryptoProvider } from "@azure/msal-node";
import { AppSettings } from "../config/AppSettings";
export declare abstract class BaseAuthClient {
    appSettings: AppSettings;
    protected msalConfig: Configuration;
    protected msalClient: ConfidentialClientApplication;
    protected cryptoProvider: CryptoProvider;
    protected logger: Logger;
    protected constructor(appSettings: AppSettings, msalConfig: Configuration);
    getMsalClient(): ConfidentialClientApplication;
    getMsalConfig(): Configuration;
    getLogger(): Logger;
}
