/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IUri, UrlString } from "@azure/msal-common";

export class UrlUtils {
    /**
     * Returns the absolute URL from a given request and path string
     * @param {string} url: a given URL
     * @param {string} protocol: protocol of the request
     * @param {string} host: host of the request
     * @returns {string}
     */
    static ensureAbsoluteUrl = (url: string, protocol: string, host: string): string => {
        const urlComponents: IUri = new UrlString(url).getUrlComponents();

        if (!urlComponents.Protocol) {
            if (!urlComponents.HostNameAndPort && !url.startsWith("www")) {
                if (!url.startsWith("/")) {
                    return protocol + "://" + host + "/" + url;
                }
                return protocol + "://" + host + url;
            }
            return protocol + "://" + url;
        } else {
            return url;
        }
    };

    /**
     * Returns the path segment from a given URL
     * @param {string} url: a given URL
     * @returns {string}
     */
    static getPathFromUrl = (url: string): string => {
        const urlComponents: IUri = new UrlString(url).getUrlComponents();
        return `/${urlComponents.PathSegments.join("/")}`;
    };

    static enforceLeadingSlash = (path: string): string => {
        return path.split("")[0] === "/" ? path : "/" + path;
    };
}
