import { AppSettings, AppType, WebAppSettings } from './AppSettings';
export declare class ConfigHelper {
    /**
     * Validates the fields in the configuration file
     * @param {AppSettings} appSettings: configuration object
     * @returns {void}
     */
    static validateAppSettings(appSettings: AppSettings, appType: AppType): void;
    /**
     * Verifies if a string is GUID
     * @param {string} guid
     * @returns {boolean}
     */
    static isGuid(guid: string): boolean;
    /**
     * Util method to get the resource name for a given scope(s)
     * @param {Array} scopes: an array of scopes that the resource is associated with
     * @param {AppSettings} appSettings: application authentication parameters
     * @returns {string}
     */
    static getResourceNameFromScopes(scopes: string[], webAppSettings: WebAppSettings): string;
    /**
     * Util method to get the scopes for a given resource name
     * @param {string} resourceEndpoint: the resource name
     * @param {AppSettings} appSettings: application authentication parameters
     * @returns {string}
     */
    static getScopesFromResourceEndpoint(resourceEndpoint: string, webAppSettings: WebAppSettings): string[];
    /**
     * Util method to strip the default OIDC scopes from the scopes array
     * @param {Array} scopesList full list of scopes for this resource
     * @returns
     */
    static getEffectiveScopes(scopesList: string[]): string[];
}
