/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { StringUtils, Constants } from "@azure/msal-common";
import { Configuration } from "@azure/msal-node";
import { AADAuthorityConstants, ConfigurationErrorMessages, OIDC_SCOPES, DEFAULT_LOGGER_OPTIONS } from "../utils/Constants";
import { AppSettings, AppType, ProtectedResourceParams, ProtectedResourcesMap, WebAppSettings } from "./AppSettingsTypes";

export class AppSettingsHelper {
    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AppSettings} appSettings: configuration object
     * @returns {Configuration}
     */
    static getMsalConfiguration(appSettings: AppSettings): Configuration {
        return {
            auth: {
                clientId: appSettings.authOptions.clientId,
                authority: appSettings.authOptions.instance
                    ? `https://${appSettings.authOptions.instance}/${appSettings.authOptions.tenantId}`
                    : `https://${Constants.DEFAULT_AUTHORITY_HOST}/${appSettings.authOptions.tenantId}`,
                ...(appSettings.authOptions.hasOwnProperty("clientSecret") && {
                    clientSecret: appSettings.authOptions.clientSecret,
                }),
                ...(appSettings.authOptions.hasOwnProperty("clientCertificate") && {
                    clientCertificate: appSettings.authOptions.clientCertificate,
                }),
            },
            system: {
                loggerOptions: appSettings.systemOptions?.loggerOptions ? appSettings.systemOptions.loggerOptions : DEFAULT_LOGGER_OPTIONS,
                proxyUrl: appSettings.systemOptions?.proxyUrl
            },
        };
    }

    /**
     * Validates the fields in the configuration file
     * @param {AppSettings} appSettings: configuration object
     */
    static validateAppSettings(appSettings: AppSettings, appType: AppType): void {
        if (StringUtils.isEmpty(appSettings.authOptions.clientId)) {
            throw new Error(ConfigurationErrorMessages.NO_CLIENT_ID);
        } else if (!AppSettingsHelper.isGuid(appSettings.authOptions.clientId)) {
            throw new Error(ConfigurationErrorMessages.INVALID_CLIENT_ID);
        }

        if (StringUtils.isEmpty(appSettings.authOptions.tenantId)) {
            throw new Error(ConfigurationErrorMessages.NO_TENANT_INFO);
        } else if (
            !AppSettingsHelper.isGuid(appSettings.authOptions.tenantId) &&
            !Object.values(AADAuthorityConstants).includes(appSettings.authOptions.tenantId)
        ) {
            throw new Error(ConfigurationErrorMessages.INVALID_TENANT_INFO);
        }

        switch (appType) {
            case AppType.WebApp:
                if (StringUtils.isEmpty((<WebAppSettings>appSettings).authRoutes.redirectUri)) {
                    throw new Error(ConfigurationErrorMessages.NO_REDIRECT_URI);
                }
                break;
            default:
                break;
        }
    }

    /**
     * Util method to get the resource name for a given scope(s)
     * @param {Array} scopes: an array of scopes from the token response
     * @param {ProtectedResourcesMap} protectedResources: application authentication parameters
     * @returns {string}
     */
    static getResourceNameFromScopes(scopes: string[], protectedResources: ProtectedResourcesMap): string {
        const effectiveScopes = this.getEffectiveScopes(scopes).map((scope) => scope.toLowerCase());

        const index = Object.values(protectedResources)
            .findIndex((resourceParams: ProtectedResourceParams) =>
                resourceParams.scopes.every((scope) => effectiveScopes.includes(scope.toLowerCase()))
            );

        const resourceName = Object.keys(protectedResources)[index];
        return resourceName;
    }

    /**
     * Util method to strip the default OIDC scopes from the scopes array
     * @param {Array} scopesList: full list of scopes for this resource
     * @returns {Array}
     */
    static getEffectiveScopes(scopesList: string[]): string[] {
        const effectiveScopesList = scopesList.filter(scope => !OIDC_SCOPES.includes(scope));
        return effectiveScopesList;
    }

    /**
     * Verifies if a given string is GUID
     * @param {string} guid
     * @returns {boolean}
     */
    static isGuid(guid: string): boolean {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regexGuid.test(guid);
    }
}
