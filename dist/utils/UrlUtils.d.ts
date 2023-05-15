import { Request } from "../middleware/MiddlewareTypes";
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
     *
     * @param req
     * @param url
     * @returns
     */
    static ensureAbsoluteUrlFromRequest: (req: Request, url?: string | undefined) => string;
    /**
     *
     * @param req
     * @param url
     * @returns
     */
    static checkIfRequestsMatch: (req: Request, url: string) => boolean;
    /**
     * Returns the path segment from a given URL
     * @param {string} url: a given URL
     * @returns {string}
     */
    static getPathFromUrl: (url: string) => string;
    /**
     * Ensures that the URL contains a trailing slash at the end
     * @param {string} path: a given path
     * @returns {string}
     */
    static enforceLeadingSlash: (path: string) => string;
}
