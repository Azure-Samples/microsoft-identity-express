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
    Configuration,
    LogLevel 
} from "@azure/msal-node";

import { AppSettings } from "./Types";

import { 
    AADAuthorityConstants, 
    ConfigurationErrorMessages 
} from "./Constants";

export class ConfigurationUtils {

    /**
     * Validates the fields in the configuration file
     * @param {AppSettings} config: configuration object
     * @returns {void}
     */
    static validateAppSettings(config: AppSettings): void {
        if (StringUtils.isEmpty(config.appCredentials.clientId)) {
            throw new Error(ConfigurationErrorMessages.NO_CLIENT_ID);
        } else if (!ConfigurationUtils.isGuid(config.appCredentials.clientId)) {
            throw new Error(ConfigurationErrorMessages.INVALID_CLIENT_ID);
        }

        if (StringUtils.isEmpty(config.appCredentials.tenantId)) {
            throw new Error(ConfigurationErrorMessages.NO_TENANT_INFO);
        } else if (!ConfigurationUtils.isGuid(config.appCredentials.tenantId) && !Object.values(AADAuthorityConstants).includes(config.appCredentials.tenantId)) {
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
     * @param {AppSettings} config: configuration object
     * @param {ICachePlugin} cachePlugin: persistent cache implementation
     * @returns {Configuration}
     */
    static getMsalConfiguration(config: AppSettings, cachePlugin: ICachePlugin = null): Configuration {
        return {
            auth: {
                clientId: config.appCredentials.clientId,
                authority: config.b2cPolicies ?
                    Object.entries(config.b2cPolicies)[0][1]["authority"]
                    :
                    `https://${Constants.DEFAULT_AUTHORITY_HOST}/${config.appCredentials.tenantId}`,
                ...(config.appCredentials.hasOwnProperty("clientSecret")) && { clientSecret: config.appCredentials.clientSecret },
                ...(config.appCredentials.hasOwnProperty("clientCertificate")) && { clientCertificate: config.appCredentials.clientCertificate },
                knownAuthorities: config.b2cPolicies ?
                    [UrlString.getDomainFromUrl(Object.entries(config.b2cPolicies)[0][1]["authority"])] // in B2C scenarios
                    :
                    [],
            },
            cache: {
                cachePlugin,
            },
            system: {
                loggerOptions: {
                    loggerCallback: (logLevel, message, containsPii) => {
                        if (containsPii) {
                            return;
                        }
                        switch (logLevel) {
                            case LogLevel.Error:
                                console.error(message);
                                return;
                            case LogLevel.Info:
                                console.info(message);
                                return;
                            case LogLevel.Verbose:
                                console.debug(message);
                                return;
                            case LogLevel.Warning:
                                console.warn(message);
                                return;
                        }
                    },
                    piiLoggingEnabled: false,
                    logLevel: LogLevel.Verbose,
                },
            },
        };
    };

    /**
     * verifies if a string is  GUID
     * @param guid
     */
    static isGuid(guid: string): boolean {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regexGuid.test(guid);
    }
}
