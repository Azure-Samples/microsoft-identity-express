/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    LoggerOptions,
    LogLevel,
} from "@azure/msal-common";

export const DEFAULT_LOGGER_OPTIONS: LoggerOptions = {
    loggerCallback: (logLevel, message, containsPii) => {
        if (containsPii) {
            return;
        }
        console.info(message);
    },
    piiLoggingEnabled: false,
    logLevel: LogLevel.Info,
};