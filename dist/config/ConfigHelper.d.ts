import { AppSettings } from "./AppSettings";
export declare class ConfigHelper {
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
    static getResourceNameFromScopes(scopes: string[], appSettings: AppSettings): string;
    /**
     * Util method to get the scopes for a given resource name
     * @param {string} resourceEndpoint: the resource name
     * @param {AppSettings} appSettings: application authentication parameters
     * @returns {string}
     */
    static getScopesFromResourceEndpoint(resourceEndpoint: string, appSettings: AppSettings): string[];
}
