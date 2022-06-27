/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Resource, AccessRule } from '../config/AppSettings';

export type SignInOptions = {
    postLoginRedirect: string;
    failureRedirect: string;
};

export type SignOutOptions = {
    postLogoutRedirect: string;
};

export type TokenRequestOptions = {
    resource: Resource;
};

export type GuardOptions = {
    accessRule: AccessRule;
};
