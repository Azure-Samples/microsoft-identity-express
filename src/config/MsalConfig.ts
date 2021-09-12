/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    UrlString,
    StringUtils,
    Constants,
} from "@azure/msal-common";

import {
    ICachePlugin,
    Configuration
} from "@azure/msal-node";

import { AppSettings } from "./AppSettings";
import { ConfigHelper } from "./ConfigHelper";
import { DistributedCachePlugin } from "../cache/DistributedCachePlugin";
import { IDistributedPersistence } from "../cache/IDistributedPersistence";

import {
    AADAuthorityConstants,
    ConfigurationErrorMessages
} from "../utils/Constants";

import {
    DEFAULT_LOGGER_OPTIONS
} from "../utils/Constants"

export class ConfigurationBuilder {

    /**
     * Validates the fields in the configuration file
     * @param {AppSettings} config: configuration object
     * @returns {void}
     */
    static validateAppSettings(config: AppSettings): void {
        if (StringUtils.isEmpty(config.appCredentials.clientId)) {
            throw new Error(ConfigurationErrorMessages.NO_CLIENT_ID);
        } else if (!ConfigHelper.isGuid(config.appCredentials.clientId)) {
            throw new Error(ConfigurationErrorMessages.INVALID_CLIENT_ID);
        }

        if (StringUtils.isEmpty(config.appCredentials.tenantInfo)) {
            throw new Error(ConfigurationErrorMessages.NO_TENANT_INFO);
        } else if (!ConfigHelper.isGuid(config.appCredentials.tenantInfo) && !Object.values(AADAuthorityConstants).includes(config.appCredentials.tenantInfo)) {
            throw new Error(ConfigurationErrorMessages.INVALID_TENANT_INFO);
        }

        if (StringUtils.isEmpty(config.appCredentials.clientSecret) && !config.appCredentials.clientCertificate) {
            throw new Error(ConfigurationErrorMessages.NO_CLIENT_CREDENTIAL);
        }

        if (StringUtils.isEmpty(config.authRoutes.redirect)) {
            throw new Error(ConfigurationErrorMessages.NO_REDIRECT_URI);
        }

        if (StringUtils.isEmpty(config.authRoutes.error)) {
            throw new Error(ConfigurationErrorMessages.NO_ERROR_ROUTE);
        }

        if (StringUtils.isEmpty(config.authRoutes.unauthorized)) {
            throw new Error(ConfigurationErrorMessages.NO_UNAUTHORIZED_ROUTE);
        }
    };


    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AppSettings} appSettings: configuration object
     * @param {ICachePlugin} cachePlugin: persistent cache implementation
     * @returns {Configuration}
     */
    static getMsalConfiguration(appSettings: AppSettings, persistenceManager?: IDistributedPersistence, cachePlugin?: ICachePlugin): Configuration {
        return {
            auth: {
                clientId: appSettings.appCredentials.clientId,
                authority: appSettings.b2cPolicies ?
                    Object.entries(appSettings.b2cPolicies)[0][1]["authority"] // the first policy/user-flow is the default authority
                    :
                    appSettings.appCredentials.instance ? `https://${appSettings.appCredentials.instance}/${appSettings.appCredentials.tenantInfo}` 
                    :
                    `https://${Constants.DEFAULT_AUTHORITY_HOST}/${appSettings.appCredentials.tenantInfo}`,
                ...(appSettings.appCredentials.hasOwnProperty("clientSecret")) && { clientSecret: appSettings.appCredentials.clientSecret },
                ...(appSettings.appCredentials.hasOwnProperty("clientCertificate")) && { clientCertificate: appSettings.appCredentials.clientCertificate },
                knownAuthorities: appSettings.b2cPolicies ?
                    [UrlString.getDomainFromUrl(Object.entries(appSettings.b2cPolicies)[0][1]["authority"])] // in B2C scenarios
                    :
                    [],
            },
            cache: {
                cachePlugin: cachePlugin ? cachePlugin : DistributedCachePlugin.getInstance(persistenceManager),
            },
            system: {
                loggerOptions: appSettings.loggerOptions ? appSettings.loggerOptions : DEFAULT_LOGGER_OPTIONS,
            },
        };
    };
}
