import { AuthError } from "@azure/msal-node";
/**
 * ConfigurationErrorMessage class containing string constants used by error codes and messages.
 */
export declare const ConfigurationErrorConfigurationErrorMessage: {
    configurationMissing: {
        code: string;
        desc: string;
    };
    configurationFailed: {
        code: string;
        desc: string;
    };
};
/**
 * Token Validation library error class thrown for configuration errors
 */
export declare class ConfigurationError extends AuthError {
    constructor(errorCode: string, errorMessage?: string);
    /**
     * Creates an error thrown when configuration is missing.
     *
     * @returns {ConfigurationError} Empty issuer error
     */
    static createConfigurationMissingError(): ConfigurationError;
    /**
     * Creates an error thrown when configuration cannot be read.
     *
     * @returns {ConfigurationError} Empty issuer error
     */
    static createConfigurationFailedError(): ConfigurationError;
}
