import { TokenCacheContext, ICachePlugin } from "@azure/msal-common";
/**
 * This implements ICachePlugin for persistent caching. Cache is persisted in a simple json file. For more information, visit:
 * https://azuread.github.io/microsoft-authentication-library-for-js/ref/interfaces/_azure_msal_common.icacheplugin.html
 */
export declare class cachePlugin implements ICachePlugin {
    private cacheLocation;
    constructor(cacheLocation: string);
    getCachePlugin: () => ICachePlugin;
    beforeCacheAccess: (cacheContext: TokenCacheContext) => Promise<void>;
    afterCacheAccess: (cacheContext: TokenCacheContext) => Promise<void>;
}
