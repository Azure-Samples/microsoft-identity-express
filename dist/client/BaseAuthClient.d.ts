import { Logger, LoggerOptions } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration, CryptoProvider } from "@azure/msal-node";
import { AppSettings } from "../config/AppSettings";
import { CryptoUtils } from "../utils/CryptoUtils";
export declare abstract class BaseAuthClient {
    appSettings: AppSettings;
    protected msalConfig: Configuration;
    protected cryptoProvider: CryptoProvider;
    protected cryptoUtils: CryptoUtils;
    protected logger: Logger;
    protected loggerOptions: LoggerOptions;
    protected constructor(appSettings: AppSettings, msalConfig: Configuration);
    getMsalInstance(): ConfidentialClientApplication;
    getMsalConfig(): Configuration;
    getLogger(): Logger;
}
