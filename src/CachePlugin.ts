/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import fs from "fs";
import { TokenCacheContext, ICachePlugin } from "@azure/msal-common";

/**
 * This implements ICachePlugin for persistent caching. Cache is persisted in a simple json file. For more information, visit: 
 * https://azuread.github.io/microsoft-authentication-library-for-js/ref/interfaces/_azure_msal_common.icacheplugin.html
 */

export class cachePlugin implements ICachePlugin {

    private cacheLocation: string;

    constructor(cacheLocation: string) {
        this.cacheLocation = cacheLocation;
    }

    getCachePlugin = (): ICachePlugin => {
        return {
            beforeCacheAccess: this.beforeCacheAccess,
            afterCacheAccess: this.afterCacheAccess
        }
    }

    beforeCacheAccess = (cacheContext: TokenCacheContext): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(this.cacheLocation)) {
                fs.readFile(this.cacheLocation, "utf-8", (err, data) => {
                    if (err) {
                        reject();
                    } else {
                        cacheContext.tokenCache.deserialize(data);
                        resolve();
                    }
                });
            } else {
                fs.writeFile(this.cacheLocation, cacheContext.tokenCache.serialize(), (err) => {
                    if (err) {
                        reject();
                    }
                });
            }
        });
    }

    afterCacheAccess = (cacheContext: TokenCacheContext): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (cacheContext.cacheHasChanged) {
                fs.writeFile(this.cacheLocation, cacheContext.tokenCache.serialize(), (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    };
}