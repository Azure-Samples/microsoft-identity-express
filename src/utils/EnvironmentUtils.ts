/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    AppServiceEnvironmentVariables,
} from "./Constants";

export class EnvironmentUtils {
    static isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    static isDevelopment(): boolean {
        return process.env.NODE_ENV === 'development';
    }

    static isAppServiceAuthEnabled(): boolean {
        return process.env[AppServiceEnvironmentVariables.WEBSITE_AUTH_ENABLED] === "True";
    }
}