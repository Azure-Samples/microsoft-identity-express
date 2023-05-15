/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Configuration } from "@azure/msal-node";
import { BaseAuthProvider } from "./BaseAuthProvider";
import { AppSettingsHelper } from "../config/AppSettingsHelper";
import { FetchManager } from "../network/FetchManager";
import { AppSettings, WebAppSettings, AppType } from "../config/AppSettingsTypes";
import { RequestHandler, ErrorRequestHandler } from "../middleware/MiddlewareTypes";
import { AuthenticateMiddlewareOptions, RouteGuardOptions } from "../middleware/MiddlewareOptions";
import authenticateMiddleware from "../middleware/authenticateMiddleware";
import guardMiddleware from "../middleware/guardMiddleware";
import errorMiddleware from "../middleware/errorMiddlewarer";

export class WebAppAuthProvider extends BaseAuthProvider {
    webAppSettings: WebAppSettings;

    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @constructor
     */
    private constructor(appSettings: AppSettings, msalConfig: Configuration) {
        super(appSettings, msalConfig);
        this.webAppSettings = appSettings as WebAppSettings;
    }

    /**
     * Static method to async initialize WebAppAuthProvider
     * @param {AuthenticateMiddlewareOptions} appSettings: configuration object
     * @returns {Promise<WebAppAuthProvider>}
     */
    static async initialize(appSettings: AppSettings): Promise<WebAppAuthProvider> {
        AppSettingsHelper.validateAppSettings(appSettings, AppType.WebApp);

        const msalConfig = AppSettingsHelper.getMsalConfiguration(appSettings);

        const [discoveryMetadata, authorityMetadata] = await Promise.all([
            FetchManager.fetchCloudDiscoveryMetadata(appSettings.authOptions.tenantId),
            FetchManager.fetchAuthorityMetadata(appSettings.authOptions.tenantId)
        ]);

        msalConfig.auth.cloudDiscoveryMetadata = discoveryMetadata;
        msalConfig.auth.authorityMetadata = authorityMetadata;

        return new WebAppAuthProvider(appSettings, msalConfig);
    }

    /**
     * Sets request context, default routes and handlers
     * @param {AuthenticateMiddlewareOptions} options: options to modify middleware behavior
     * @returns {RequestHandler}
     */
    authenticate(options: AuthenticateMiddlewareOptions = {
        protectAllRoutes: false,
        useSession: true,
    }): RequestHandler {
        return authenticateMiddleware.call(this, options);
    }

    /**
     * Guards a specified route with given options
     * @param {RouteGuardOptions} options: options to modify middleware behavior
     * @returns {RequestHandler}
     */
    guard(options: RouteGuardOptions = {
        forceLogin: true,
    }): RequestHandler {
        return guardMiddleware.call(this, options);
    }

    /**
     * Middleware to handle interaction required errors
     * @returns {ErrorRequestHandler}
     */
    interactionErrorHandler(): ErrorRequestHandler {
        return errorMiddleware.call(this);
    }
}
