/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { UrlString, Constants } from "@azure/msal-common";
import { Configuration, ICachePlugin, LogLevel } from "@azure/msal-node";

import { AppSettings } from "./Types";

export class ConfigurationUtils {

    /**
     * Validates the fields in the configuration file
     * @param {AppSettings} config: configuration object
     * @returns {void}
     */
    static validateAppSettings(config: AppSettings): void {
        if (!config.appCredentials.clientId) {
            throw new Error("No clientId provided!");
        }

        if (!config.appCredentials.tenantId) {
            throw new Error("No tenant info provided!");
        }

        if (!config.appCredentials.clientSecret && !config.appCredentials.clientCertificate) {
            throw new Error("No client credential provided!");
        }
    };


    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AppSettings} config: configuration object
     * @param {ICachePlugin} cachePlugin: persistent cache implementation
     * @returns {Configuration}
     */
    static getMsalConfiguration(config: AppSettings, cachePlugin: ICachePlugin = null): Configuration {
        return {
            auth: {
                clientId: config.appCredentials.clientId,
                authority: config.b2cPolicies
                    ? Object.entries(config.b2cPolicies)[0][1]["authority"]
                    : `https://${Constants.DEFAULT_AUTHORITY_HOST}/${config.appCredentials.tenantId}`,
                ...(config.appCredentials.hasOwnProperty("clientSecret")) && {clientSecret: config.appCredentials.clientSecret},
                ...(config.appCredentials.hasOwnProperty("clientCertificate")) && {clientCertificate: config.appCredentials.clientCertificate},
                knownAuthorities: config.b2cPolicies
                    ? [UrlString.getDomainFromUrl(Object.entries(config.b2cPolicies)[0][1]["authority"])]
                    : [], // in B2C scenarios
            },
            cache: {
                cachePlugin,
            },
            system: {
                loggerOptions: {
                    loggerCallback: (logLevel, message, containsPii) => {
                        console.log(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: LogLevel.Verbose,
                },
            },
        };
    };
}
