/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { InteractionRequiredAuthError } from "@azure/msal-node";

/**
 * Token Validation library error class thrown for configuration errors
 */
export class InteractionRequiredError extends InteractionRequiredAuthError {
    scopes: Array<string> = [];

    constructor(errorCode: string, errorMessage?: string, subError?: string, scopes?: Array<string>, claims?: string) {
        super(errorCode, errorMessage, subError);
        this.name = "InteractionRequiredError";
        this.scopes = scopes || [];
        this.claims = claims || "";
        
        Object.setPrototypeOf(this, InteractionRequiredError.prototype);
    }
}
