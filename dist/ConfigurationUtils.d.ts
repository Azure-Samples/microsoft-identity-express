import { Configuration, ICachePlugin } from "@azure/msal-node";
import { AppSettings } from "./Types";
export declare class ConfigurationUtils {
    /**
     * Validates the fields in the configuration file
     * @param {AppSettings} config: configuration object
     * @returns {void}
     */
    static validateAppSettings(config: AppSettings): void;
    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AppSettings} config: configuration object
     * @param {ICachePlugin} cachePlugin: persistent cache implementation
     * @returns {Configuration}
     */
    static getMsalConfiguration(config: AppSettings, cachePlugin?: ICachePlugin): Configuration;
}
