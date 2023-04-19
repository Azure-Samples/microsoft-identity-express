export declare class UrlUtils {
    /**
     * Returns the absolute URL from a given request and path string
     * @param {string} url: a given URL
     * @param {string} protocol: protocol of the request
     * @param {string} host: host of the request
     * @returns {string}
     */
    static ensureAbsoluteUrl: (url: string, protocol: string, host: string) => string;
    /**
     * Returns the path segment from a given URL
     * @param {string} url: a given URL
     * @returns {string}
     */
    static getPathFromUrl: (url: string) => string;
    static enforceLeadingSlash: (path: string) => string;
}
