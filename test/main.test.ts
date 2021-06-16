/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AuthProvider } from '../src/AuthProvider';
import { AppSettings } from '../src/Types';
import { TEST_CONSTANTS } from './TestConstants';

test('instantiates a class', () => {
  let appSettings: AppSettings = {
    appCredentials: {
      clientId: TEST_CONSTANTS.CLIENT_ID,
      tenantId: TEST_CONSTANTS.TENANT_ID,
      clientSecret: TEST_CONSTANTS.CLIENT_SECRET,
    },
    authRoutes: {
      redirect: TEST_CONSTANTS.APP_ROUTE,
      error: TEST_CONSTANTS.APP_ROUTE,
      unauthorized: TEST_CONSTANTS.APP_ROUTE
    },
  };

  const authApp = new AuthProvider(appSettings);
  expect(authApp).toBeInstanceOf(AuthProvider);
});
