/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Request } from "express";
import { IUri, UrlString } from "@azure/msal-common";

export class UrlUtils {
    /**
     * Gets the absolute URL from a given request and path string
     * @param {Request} req: express request object 
     * @param {string} url: a given URL
     * @returns {string}
     */
    static ensureAbsoluteUrl = (req: Request, url: string): string => {
        const urlComponents: IUri = new UrlString(url).getUrlComponents();

        if (!urlComponents.Protocol) {
            if (!urlComponents.HostNameAndPort && !url.startsWith("www")) {
                if (!url.startsWith("/")) {
                    return req.protocol + "://" + req.get("host") + "/" + url;
                }
                return req.protocol + "://" + req.get("host") + url;
            }
            return req.protocol + "://" + url;
        } else {
            return url;
        }
    };

    /**
     * Gets the path segment from a given URL
     * @param {string} url: a given URL
     * @returns {string}
     */
    static getPathFromUrl = (url: string): string => {
        const urlComponents: IUri = new UrlString(url).getUrlComponents();
        return `/${urlComponents.PathSegments.join("/")}`;
    };
}
