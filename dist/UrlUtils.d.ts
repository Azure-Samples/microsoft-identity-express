import { Request } from "express";
export declare class UrlUtils {
    /**
     * Gets the absolute URL from a given request and path string
     * @param {Request} req: express request object
     * @param {string} url: a given URL
     * @returns {string}
     */
    static ensureAbsoluteUrl: (req: Request, url: string) => string;
}
