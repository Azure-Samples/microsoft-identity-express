/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export { WebAppAuthClientBuilder } from './client/webapp/WebAppAuthClientBuilder';

export { MsalWebAppAuthClient } from './client/webapp/MsalWebAppAuthClient';
export { AppServiceWebAppAuthClient } from './client/webapp/AppServiceWebAppAuthClient';

export { 
    AppSettings, 
    AppCredentials, 
    AccessRule,
    ClientCertificate, 
    AuthRoutes, 
    Policy, 
    Resource, 
    WebAppSettings,
    KeyVaultCredential
} from './config/AppSettings';

export {
    GuardOptions, 
    SignInOptions, 
    SignOutOptions, 
    TokenRequestOptions
} from './client/MiddlewareOptions';

export {
    AccessTokenClaims,
    IdTokenClaims,
    AppState,
} from './utils/Types';

export { ConfigHelper } from './config/ConfigHelper';
export { MsalConfiguration } from './config/MsalConfiguration';

export { FetchManager } from './network/FetchManager';
export { KeyVaultManager } from './network/KeyVaultManager';

export { packageVersion } from './packageMetadata';
