/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { StringUtils } from '@azure/msal-common';

import { AADAuthorityConstants, ConfigurationErrorMessages, OIDC_SCOPES } from '../utils/Constants';
import { AppSettings, AppType, Resource, WebAppSettings } from './AppSettings';

export class ConfigHelper {
    /**
     * Validates the fields in the configuration file
     * @param {AppSettings} appSettings: configuration object
     * @returns {void}
     */
    static validateAppSettings(appSettings: AppSettings, appType: AppType): void {
        if (StringUtils.isEmpty(appSettings.appCredentials.clientId)) {
            throw new Error(ConfigurationErrorMessages.NO_CLIENT_ID);
        } else if (!ConfigHelper.isGuid(appSettings.appCredentials.clientId)) {
            throw new Error(ConfigurationErrorMessages.INVALID_CLIENT_ID);
        }

        if (StringUtils.isEmpty(appSettings.appCredentials.tenantId)) {
            throw new Error(ConfigurationErrorMessages.NO_TENANT_INFO);
        } else if (
            !ConfigHelper.isGuid(appSettings.appCredentials.tenantId) &&
            !Object.values(AADAuthorityConstants).includes(appSettings.appCredentials.tenantId)
        ) {
            throw new Error(ConfigurationErrorMessages.INVALID_TENANT_INFO);
        }

        switch (appType) {
            case AppType.WebApp:
                if (StringUtils.isEmpty((<WebAppSettings>appSettings).authRoutes?.redirect)) {
                    throw new Error(ConfigurationErrorMessages.NO_REDIRECT_URI);
                }

                if (StringUtils.isEmpty((<WebAppSettings>appSettings).authRoutes?.unauthorized)) {
                    throw new Error(ConfigurationErrorMessages.NO_UNAUTHORIZED_ROUTE);
                }

                break;
            default:
                break;
        }
    }

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
    static getResourceNameFromScopes(scopes: string[], webAppSettings: WebAppSettings): string {
        const index = Object.values({
            ...webAppSettings.protectedResources,
        }).findIndex((resource: Resource) =>
            JSON.stringify(resource.scopes.sort()) === JSON.stringify(scopes.sort())
        );

        const resourceName = Object.keys({
            ...webAppSettings.protectedResources,
        })[index];

        return resourceName;
    }

    /**
     * Util method to get the scopes for a given resource name
     * @param {string} resourceEndpoint: the resource name
     * @param {AppSettings} appSettings: application authentication parameters
     * @returns {string}
     */
    static getScopesFromResourceEndpoint(resourceEndpoint: string, webAppSettings: WebAppSettings): string[] {
        const scopes = Object.values({
            ...webAppSettings.protectedResources,
        }).find((resource: Resource) => resource.endpoint === resourceEndpoint)?.scopes;

        return scopes ? scopes : [];
    }

    /**
     * Util method to strip the default OIDC scopes from the scopes array
     * @param {Array} scopesList full list of scopes for this resource
     * @returns
     */
    static getEffectiveScopes(scopesList: string[]): string[] {
        const effectiveScopesList = scopesList.filter(scope => !OIDC_SCOPES.includes(scope));
        return effectiveScopesList;
    }
}
