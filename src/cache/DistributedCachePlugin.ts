/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ICachePlugin } from "@azure/msal-node";
import { IDistributedPersistence } from "./IDistributedPersistence";

export class DistributedCachePlugin implements ICachePlugin {

    private static instance: DistributedCachePlugin;

    private persistenceManager: IDistributedPersistence;
    private persistenceKey: string;

    private constructor(persistenceManager: IDistributedPersistence, persistenceKey?: string) {
        this.persistenceManager = persistenceManager;
        this.persistenceKey = persistenceKey;
    }

    static getInstance(persistenceManager: IDistributedPersistence, persistenceKey?: string): DistributedCachePlugin {
        if (!DistributedCachePlugin.instance) {
            DistributedCachePlugin.instance = new DistributedCachePlugin(persistenceManager, persistenceKey);
        }

        return DistributedCachePlugin.instance;
    }

    async beforeCacheAccess(cacheContext): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const sessionData = await this.persistenceManager.get(this.persistenceKey);
            if (sessionData) {
                const cacheData = await this.persistenceManager.get(JSON.parse(sessionData).account.homeAccountId);
                cacheContext.tokenCache.deserialize(cacheData);
            }
            resolve();
        });
    }

    async afterCacheAccess(cacheContext): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (cacheContext.cacheHasChanged) {
                const kvStore = cacheContext.tokenCache.getKVStore();
                const homeAccountId = Object.values(kvStore)[1]["homeAccountId"];
                await this.persistenceManager.set(homeAccountId, cacheContext.tokenCache.serialize());
            }
            resolve();
        });
    }
}