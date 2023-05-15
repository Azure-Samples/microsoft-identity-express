/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AccountInfo, AuthenticationResult, AuthorizationCodeRequest } from "@azure/msal-node";
import { AuthContext } from "./context/AuthContext";

export type Request = {
    authContext: AuthContext
    session: Session,
    originalUrl: string,
    protocol: string,
    hostname: string,
    method: string,
    body?: {
        [key: string]: string | number | undefined | unknown;
    },
    get: (key: string) => string,
};

export type Response = object & {
    status: (code: number) => Response,
    send: (message: string) => void,
    sendStatus: (code: number) => void,
    redirect: (url: string) => void,
};

export type NextFunction = (err?: unknown) => void;

export type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

export type RequestContext = { req: Request, res: Response, next: NextFunction };

export type ErrorRequestHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => void;

export type Session = {
    account: AccountInfo;
    tokenCache: string,
    isAuthenticated: boolean;
    protectedResources: Record<string, AuthenticationResult>
    tokenRequestParams: AuthorizationCodeRequest;
    destroy: (callback: () => void) => void;
};
