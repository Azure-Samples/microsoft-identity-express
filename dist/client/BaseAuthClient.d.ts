import { Logger } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration, CryptoProvider } from "@azure/msal-node";
import { TokenValidator } from "../crypto/TokenValidator";
import { AppSettings } from "../config/AppSettings";
export declare abstract class BaseAuthClient {
    appSettings: AppSettings;
    protected msalConfig: Configuration;
    protected msalClient: ConfidentialClientApplication;
    protected tokenValidator: TokenValidator;
    protected cryptoProvider: CryptoProvider;
    protected logger: Logger;
    protected constructor(appSettings: AppSettings, msalConfig: Configuration);
    getMsalClient(): ConfidentialClientApplication;
    getMsalConfig(): Configuration;
    getLogger(): Logger;
}
