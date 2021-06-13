import { Request } from "express";
export declare class UrlUtils {
    private baseUrl;
    /**
     * @param {string} baseUrl
     * @constructor
     */
    constructor(baseUrl?: string);
    /**
     * Gets the absolute URL from a given request and path string
     * @param {Request} req
     * @param {string} uri
     * @returns {string}
     */
    ensureAbsoluteUrl: (req: Request, uri: string) => string;
}
