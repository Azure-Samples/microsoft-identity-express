/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express, {
    RequestHandler,
    Request,
    Response,
    NextFunction,
    Router
} from "express";

import {
    AuthenticationResult,
} from "@azure/msal-common";

import {
    Configuration,
    OnBehalfOfRequest,
} from "@azure/msal-node";

import { BaseAuthClient } from "../BaseAuthClient";

import {
    AppSettings,
} from "../../config/AppSettings";

import {
    InitializationOptions,
    TokenRequestOptions,
} from "../MiddlewareOptions";

import {
    ErrorMessages,
} from "../../utils/Constants";

/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in RESTful APIs.
 */
export class MsalWebApiAuthClient extends BaseAuthClient {

    /**
     * @param {AppSettings} appSettings
     * @param {Configuration} msalConfig
     * @constructor
     */
    constructor(appSettings: AppSettings, msalConfig: Configuration) {
        super(appSettings, msalConfig);
    }

    /**
     * Initialize AuthProvider and set default routes and handlers
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    initialize(options?: InitializationOptions): Router {
        const appRouter = express.Router();

        appRouter.use((req: Request, res: Response, next: NextFunction) => {
            // TODO: add defaults
            next();
        });

        return appRouter;
    }

    /**
     * Middleware that gets tokens via OBO flow. Used in web API scenarios
     * @param {TokenRequestOptions} options: options to modify this middleware
     * @returns {RequestHandler}
     */
    getTokenOnBehalf(options: TokenRequestOptions): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const authHeader: string = req.headers.authorization;

            // get scopes for token request
            const scopes: string[] = options.resource.scopes;

            // get the raw access token from authZ header
            const rawAccessToken: string = authHeader.split(" ")[1];
            req.oboAssertion = rawAccessToken;

            const oboRequest: OnBehalfOfRequest = {
                oboAssertion: rawAccessToken,
                scopes: scopes,
            }

            try {
                // TODO: check cache first
                const tokenResponse: AuthenticationResult = await this.msalClient.acquireTokenOnBehalfOf(oboRequest);
                req.oboToken = tokenResponse.accessToken;
                next();
            } catch (error) {
                next(error);
            }
        }
    }

    /**
     * Receives access token in req authorization header
     * @returns {RequestHandler}
     */
    isAuthorized(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            if (req.headers.authorization) {
                next();
            } else {
                this.logger.error(ErrorMessages.TOKEN_NOT_FOUND);
                res.redirect(this.appSettings.authRoutes.unauthorized);
            }
        }
    };
}