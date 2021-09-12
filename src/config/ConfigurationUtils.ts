/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { 
    AppSettings, 
    Resource 
} from "../config/AppSettings";

export class ConfigurationUtils {
    /**
     * Util method to get the resource name for a given scope(s)
     * @param {Array} scopes: an array of scopes that the resource is associated with
     * @param {AppSettings} appSettings: application authentication parameters
     * @returns {string}
     */
    static getResourceNameFromScopes(scopes: string[], appSettings: AppSettings): string { 
        const index = Object.values({ ...appSettings.remoteResources, ...appSettings.ownedResources })
            .findIndex((resource: Resource) => JSON.stringify(resource.scopes) === JSON.stringify(scopes));

        const resourceName = Object.keys({ ...appSettings.remoteResources, ...appSettings.ownedResources })[index];
        return resourceName;
    };

    /**
     * Util method to get the scopes for a given resource name
     * @param {string} resourceName: the resource name
     * @param {AppSettings} appSettings: application authentication parameters
     * @returns {string}
     */
    static getScopesFromResourceName(resourceName: string, protectedRoute: string, appSettings: AppSettings): string[] {
        const scopes = Object.values(appSettings.ownedResources)
            .find((resource: Resource) => resource.endpoint === protectedRoute).scopes;
        
        return scopes;
    };

    /**
     * Verifies if a string is GUID
     * @param {string} guid
     * @returns {boolean}
     */
    static isGuid(guid: string): boolean {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regexGuid.test(guid);
    }
}
