/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { StringUtils } from "@azure/msal-common";

import { AADAuthorityConstants, ConfigurationErrorMessages, OIDC_SCOPES } from "../utils/Constants";
import { AppSettings, Resource } from "./AppSettings";

export class ConfigHelper {

    /**
     * Validates the fields in the configuration file
     * @param {AppSettings} appSettings: configuration object
     * @returns {void}
     */
    static validateAppSettings(appSettings: AppSettings): void {
        if (StringUtils.isEmpty(appSettings.appCredentials.clientId)) {
            throw new Error(ConfigurationErrorMessages.NO_CLIENT_ID);
        } else if (!ConfigHelper.isGuid(appSettings.appCredentials.clientId)) {
            throw new Error(ConfigurationErrorMessages.INVALID_CLIENT_ID);
        }

        if (StringUtils.isEmpty(appSettings.appCredentials.tenantId)) {
            throw new Error(ConfigurationErrorMessages.NO_TENANT_INFO);
        } else if (!ConfigHelper.isGuid(appSettings.appCredentials.tenantId) && !Object.values(AADAuthorityConstants).includes(appSettings.appCredentials.tenantId)) {
            throw new Error(ConfigurationErrorMessages.INVALID_TENANT_INFO);
        }

        if (StringUtils.isEmpty(appSettings.authRoutes.redirect)) {
            throw new Error(ConfigurationErrorMessages.NO_REDIRECT_URI);
        }

        if (StringUtils.isEmpty(appSettings.authRoutes.error)) {
            throw new Error(ConfigurationErrorMessages.NO_ERROR_ROUTE);
        }

        if (StringUtils.isEmpty(appSettings.authRoutes.unauthorized)) {
            throw new Error(ConfigurationErrorMessages.NO_UNAUTHORIZED_ROUTE);
        }
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

    /**
     * Util method to get the resource name for a given scope(s)
     * @param {Array} scopes: an array of scopes that the resource is associated with
     * @param {AppSettings} appSettings: application authentication parameters
     * @returns {string}
     */
    static getResourceNameFromScopes(scopes: string[], appSettings: AppSettings): string {
        const index = Object.values({ ...appSettings.protectedResources, ...appSettings.ownedResources })
            .findIndex((resource: Resource) => JSON.stringify(resource.scopes) === JSON.stringify(scopes));

        const resourceName = Object.keys({ ...appSettings.protectedResources, ...appSettings.ownedResources })[index];

        return resourceName;
    };

    /**
     * Util method to get the scopes for a given resource name
     * @param {string} resourceEndpoint: the resource name
     * @param {AppSettings} appSettings: application authentication parameters
     * @returns {string}
     */
    static getScopesFromResourceEndpoint(resourceEndpoint: string, appSettings: AppSettings): string[] {
        const scopes = Object.values({ ...appSettings.protectedResources, ...appSettings.ownedResources })
            .find((resource: Resource) => resource.endpoint === resourceEndpoint).scopes;

        return scopes;
    };

    static getEffectiveScopes(scopesList: string[]): string[] {
        const effectiveScopesList = scopesList.filter(scope => !OIDC_SCOPES.includes(scope));
        return effectiveScopesList;
    }
}
