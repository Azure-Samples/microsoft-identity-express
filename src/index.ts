/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export { 
    InteractionRequiredAuthError, 
    NodeSystemOptions, 
    AuthError, 
    Logger, 
    AccountInfo 
} from "@azure/msal-node";

export { WebAppAuthProvider } from "./provider/WebAppAuthProvider";

export {
    WebAppSettings,
    AuthRoutes,
    AuthOptions,
    AppSettings,
    ProtectedResourceParams,
    ProtectedResourcesMap
} from "./config/AppSettingsTypes";

export {
    RouteGuardOptions,
    AuthenticateMiddlewareOptions,
    LoginOptions,
    LogoutOptions,
    TokenRequestOptions,
    AppState,
    IdTokenClaims
} from "./middleware/MiddlewareOptions";

export { packageVersion } from "./packageMetadata";
