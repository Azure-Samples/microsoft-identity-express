import { IdTokenEntity, AccessTokenEntity, RefreshTokenEntity } from '@azure/msal-common';
import { CacheKVStore } from '@azure/msal-node';
import { CREDENTIAL_TYPES } from './constants'

export type tokenMap = {
    idTokens: IdTokenEntity[];
    accessTokens: AccessTokenEntity[];
    refreshTokens: RefreshTokenEntity[];
};

export class NodeCacheTestUtils {
    static getTokens(cacheStore: CacheKVStore): tokenMap {
        const tokenCache: tokenMap = {
            idTokens: [],
            accessTokens: [],
            refreshTokens: [],
        };

        Object.keys(cacheStore).forEach((cacheSectionKey: string) => {
            const cacheSection = cacheStore[cacheSectionKey];
            switch (cacheSection['credentialType']) {
                case CREDENTIAL_TYPES.ID_TOKEN:
                    tokenCache['idTokens'].push(cacheSection as IdTokenEntity);
                    break;
                case CREDENTIAL_TYPES.ACCESS_TOKEN:
                    tokenCache['accessTokens'].push(cacheSection as AccessTokenEntity);
                    break;
                case CREDENTIAL_TYPES.REFRESH_TOKEN:
                    tokenCache['refreshTokens'].push(cacheSection as RefreshTokenEntity);
                    break;
                default:
                    break;
            }
        });

        return tokenCache;
    }
}
