/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { InteractionRequiredAuthError } from "@azure/msal-common";

/**
 * Helper function used to determine if an error thrown by the server requires interaction to resolve
 * @param error
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function IsAnInteractionRequiredAuthError(error: any): boolean {
    return InteractionRequiredAuthError.isInteractionRequiredError(
        error?.errorCode,
        error?.errorMessage,
        error?.subError
    );
}
