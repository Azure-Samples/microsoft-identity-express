export declare class Logger {
    /**
     * Log an error
     * @param {string} log
     * @returns {void}
     */
    static logError(log: string): void;
    /**
     * Log a warning
     * @param {string} log
     * @returns {void}
     */
    static logWarning(log: string): void;
    /**
     * Log anything
     * @param {string} log
     * @returns {void}
     */
    static logInfo(log: string): void;
    /**
     * Log message with required options.
     * @param {string} logMessage
     * @returns {string}
     */
    private static logMessage;
}
