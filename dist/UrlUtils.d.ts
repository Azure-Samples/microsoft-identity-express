import { Request } from "express";
export declare class UrlUtils {
    /**
     * Gets the absolute URL from a given request and path string
     * @param {Request} req
     * @param {string} uri
     * @returns {string}
     */
    static ensureAbsoluteUrl: (req: Request, uri: string) => string;
}
