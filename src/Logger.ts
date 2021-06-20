/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-common"

export class Logger {

    /**
     * Log an error
     * @param {string} log
     * @returns {void}
     */
    static logError(log: string): void {
        console.error(this.logMessage(log));
    }

    /**
     * Log a warning
     * @param {string} log
     * @returns {void}
     */
    static logWarning(log: string): void {
        console.warn(this.logMessage(log));
    }

    /**
     * Log anything
     * @param {string} log
     * @returns {void}
     */
    static logInfo(log: string): void {
        console.info(this.logMessage(log));
    }

    /**
     * Log message with required options.
     * @param {string} logMessage 
     * @returns {string}
     */
    private static logMessage(logMessage: string): string {
        const timestamp = new Date().toUTCString();

        let logHeader: string = `[${timestamp}]`;

        const log = `${logHeader} : @azure-samples/msal-express-wrapper@0.1.0 : ${LogLevel[LogLevel.Verbose]} - ${logMessage}`;
        return log;
    }

}