/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

import {
    Logger
} from "@azure/msal-common";
import { Configuration } from "@azure/msal-node";

import {
    AuthToken,
} from "./AuthToken";

import { AppSettings } from "../config/AppSettings";

import {
    ErrorMessages,
} from "../utils/Constants";

export class TokenValidator {

    logger: Logger;
    private appSettings: AppSettings;
    private msalConfig: Configuration;

    /**
     * @param {AppSettings} appSettings 
     * @param {Configuration} msalConfig
     * @param {Logger} logger
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration, logger: Logger) {
        this.appSettings = appSettings;
        this.msalConfig = msalConfig;
        this.logger = logger;
    }

    static decodeAuthToken(authToken: string): AuthToken {

        try {
            return jwt.decode(authToken, { complete: true });
        } catch (error) {
            throw new Error(ErrorMessages.TOKEN_NOT_DECODED);
        }
    }
}
