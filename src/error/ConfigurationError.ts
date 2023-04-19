/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AuthError } from "@azure/msal-node";

/**
 * ConfigurationErrorMessage class containing string constants used by error codes and messages.
 */
export const ConfigurationErrorConfigurationErrorMessage = {
    configurationMissing: {
        code: "configuration_missing",
        desc: "TokenValidator not configured. Call configure() first."
    },
    configurationFailed: {
        code: "configuration_failed",
        desc: "TokenValidator configuration failed."
    },
};

/**
 * Token Validation library error class thrown for configuration errors
 */
export class ConfigurationError extends AuthError {

    constructor(errorCode: string, errorMessage?: string) {
        super(errorCode, errorMessage);
        this.name = "ConfigurationError";
        Object.setPrototypeOf(this, ConfigurationError.prototype);
    }

    /**
     * Creates an error thrown when configuration is missing.
     *
     * @returns {ConfigurationError} Empty issuer error
     */
    static createConfigurationMissingError(): ConfigurationError {
        return new ConfigurationError(ConfigurationErrorConfigurationErrorMessage.configurationMissing.code, ConfigurationErrorConfigurationErrorMessage.configurationMissing.desc);
    }

    /**
     * Creates an error thrown when configuration cannot be read.
     *
     * @returns {ConfigurationError} Empty issuer error
     */
    static createConfigurationFailedError(): ConfigurationError {
        return new ConfigurationError(ConfigurationErrorConfigurationErrorMessage.configurationFailed.code, ConfigurationErrorConfigurationErrorMessage.configurationFailed.desc);
    }
}
