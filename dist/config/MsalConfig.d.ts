import { ICachePlugin, Configuration } from "@azure/msal-node";
import { AppSettings } from "./AppSettings";
import { IDistributedPersistence } from "../cache/IDistributedPersistence";
export declare class ConfigurationBuilder {
    /**
     * Validates the fields in the configuration file
     * @param {AppSettings} config: configuration object
     * @returns {void}
     */
    static validateAppSettings(config: AppSettings): void;
    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AppSettings} appSettings: configuration object
     * @param {ICachePlugin} cachePlugin: persistent cache implementation
     * @returns {Configuration}
     */
    static getMsalConfiguration(appSettings: AppSettings, persistenceManager?: IDistributedPersistence, cachePlugin?: ICachePlugin): Configuration;
}
