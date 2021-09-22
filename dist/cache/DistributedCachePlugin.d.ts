import { ICachePlugin } from "@azure/msal-node";
import { IDistributedPersistence } from "./IDistributedPersistence";
export declare class DistributedCachePlugin implements ICachePlugin {
    private static instance;
    private persistenceManager;
    private persistenceKey;
    private constructor();
    static getInstance(persistenceManager: IDistributedPersistence, persistenceKey?: string): DistributedCachePlugin;
    beforeCacheAccess(cacheContext: any): Promise<void>;
    afterCacheAccess(cacheContext: any): Promise<void>;
}
