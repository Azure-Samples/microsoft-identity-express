/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { UrlString, Constants } from "@azure/msal-common";
import { Configuration, ICachePlugin, LogLevel } from "@azure/msal-node";
import { AppSettings } from "./Types";

export class ConfigurationUtils {
  /**
   * Validates the fields in the custom JSON configuration file
   * @param {AppSettings} config: configuration file
   * @returns {void}
   */
  static validateAppSettings(config: AppSettings): void {
    if (!config.appCredentials.clientId || config.appCredentials.clientId === "Enter_the_Application_Id_Here") {
      throw new Error("No clientId provided!");
    }

    if (!config.appCredentials.tenantId || config.appCredentials.tenantId === "Enter_the_Tenant_Info_Here") {
      throw new Error("No tenantId provided!");
    }

    if (!config.appCredentials.clientSecret || config.appCredentials.clientSecret === "Enter_the_Client_Secret_Here") {
      throw new Error("No clientSecret provided!");
    }
  };

  /**
   * Maps the custom JSON configuration file to configuration
   * object expected by MSAL Node ConfidentialClientApplication
   * @param {AppSettings} config: configuration file
   * @param {ICachePlugin} cachePlugin: passed during initialization
   * @returns {Configuration}
   */
  static getMsalConfiguration(config: AppSettings, cachePlugin: ICachePlugin = null): Configuration {
    return {
      auth: {
        clientId: config.appCredentials.clientId,
        authority: config.b2cPolicies
          ? Object.entries(config.b2cPolicies)[0][1]["authority"]
          : `https://${Constants.DEFAULT_AUTHORITY_HOST}/${config.appCredentials.tenantId}`,
        clientSecret: config.appCredentials.clientSecret,
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
