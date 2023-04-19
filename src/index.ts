/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export { WebAppAuthProvider } from "./provider/WebAppAuthProvider";

export {
    WebAppSettings,
    AppCredentials,
    ClientCertificate,
    AuthRoutes,
} from "./config/AppSettingsTypes";

export {
    RouteGuardOptions,
    SignInOptions,
    SignOutOptions,
    TokenRequestOptions
} from "./middleware/MiddlewareOptions";

export { packageVersion } from "./packageMetadata";
