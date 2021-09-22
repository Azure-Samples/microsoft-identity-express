import { Configuration } from "@azure/msal-node";
import { AppSettings } from "./AppSettings";
import { IDistributedPersistence } from "../cache/IDistributedPersistence";
export declare class MsalConfiguration {
    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AppSettings} appSettings: configuration object
     * @param {ICachePlugin} cachePlugin: custom cache plugin
     * @param {IDistributedPersistence} distributedPersistence: distributed persistence client
     * @returns {Configuration}
     */
    static getMsalConfiguration(appSettings: AppSettings, persistenceManager?: IDistributedPersistence): Configuration;
}
