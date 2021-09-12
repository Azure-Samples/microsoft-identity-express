import { ICachePlugin } from "@azure/msal-node";
import { IDistributedPersistence } from "./IDistributedPersistence";
import { SessionData } from "express-session";
export declare class DistributedCachePlugin implements ICachePlugin {
    private static instance;
    private persistenceManager;
    private session;
    private constructor();
    static getInstance(persistenceManager: IDistributedPersistence, session?: SessionData): DistributedCachePlugin;
    beforeCacheAccess(cacheContext: any): Promise<void>;
    afterCacheAccess(cacheContext: any): Promise<void>;
}
