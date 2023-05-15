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

/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express web apps
 */
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
        if (!msalConfig.auth.cloudDiscoveryMetadata && !msalConfig.auth.authorityMetadata) {
            const [discoveryMetadata, authorityMetadata] = await Promise.all([
                FetchManager.fetchCloudDiscoveryMetadata(appSettings.appCredentials.tenantId),
                FetchManager.fetchAuthorityMetadata(appSettings.appCredentials.tenantId),
            ]);

            msalConfig.auth.cloudDiscoveryMetadata = discoveryMetadata;
            msalConfig.auth.authorityMetadata = authorityMetadata;
        }

        return new WebAppAuthProvider(appSettings, msalConfig);
    }

    /**
     * Sets request context, default routes and handlers
     * @param {AuthenticateMiddlewareOptions} options: options to modify login request
     * @returns {Router}
     */
    authenticate(options: AuthenticateMiddlewareOptions = {
        protectAllRoutes: false,
        useSession: true,
    }): RequestHandler {
        return authenticateMiddleware.call(this, options);
    }

    guard(options: RouteGuardOptions): RequestHandler {
        return guardMiddleware.call(this, options);
    }

    interactionErrorHandler(): ErrorRequestHandler {
        return errorMiddleware.call(this);
    }
}
