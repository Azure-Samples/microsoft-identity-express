/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    UrlString,
    Constants,
} from "@azure/msal-common";

import {
    ICachePlugin,
    Configuration
} from "@azure/msal-node";

import { AppSettings } from "./AppSettings";

import {
    DEFAULT_LOGGER_OPTIONS
} from "../utils/Constants"

import { IDistributedPersistence } from "../cache/IDistributedPersistence";
import { DistributedCachePlugin } from "../cache/DistributedCachePlugin";

export class MsalConfiguration {

    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AppSettings} appSettings: configuration object
     * @param {ICachePlugin} cachePlugin: custom cache plugin
     * @param {IDistributedPersistence} distributedPersistence: distributed persistence client
     * @returns {Configuration}
     */
    static getMsalConfiguration(appSettings: AppSettings, persistenceManager?: IDistributedPersistence): Configuration {
        return {
            auth: {
                clientId: appSettings.appCredentials.clientId,
                authority: appSettings.b2cPolicies ?
                    Object.entries(appSettings.b2cPolicies)[0][1]["authority"] // the first policy/user-flow is the default authority
                    :
                    appSettings.appCredentials.instance ? `https://${appSettings.appCredentials.instance}/${appSettings.appCredentials.tenantId}` 
                    :
                    `https://${Constants.DEFAULT_AUTHORITY_HOST}/${appSettings.appCredentials.tenantId}`,
                ...(appSettings.appCredentials.hasOwnProperty("clientSecret")) && { clientSecret: appSettings.appCredentials.clientSecret },
                ...(appSettings.appCredentials.hasOwnProperty("clientCertificate")) && { clientCertificate: appSettings.appCredentials.clientCertificate },
                knownAuthorities: appSettings.b2cPolicies ?
                    [UrlString.getDomainFromUrl(Object.entries(appSettings.b2cPolicies)[0][1]["authority"])] // in B2C scenarios
                    :
                    [],
            },
            cache: {
                cachePlugin: persistenceManager ? DistributedCachePlugin.getInstance(persistenceManager) : null
            },
            system: {
                loggerOptions: appSettings.loggerOptions ? appSettings.loggerOptions : DEFAULT_LOGGER_OPTIONS,
            },
        };
    };
}
