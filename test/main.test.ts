/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AuthProvider } from '../src/AuthProvider';
import { AppSettings } from '../src/Types';
import { TEST_CONSTANTS } from './TestConstants';

test('instantiates a class', () => {
  let appSettings: AppSettings = {
    credentials: {
      clientId: TEST_CONSTANTS.CLIENT_ID,
      tenantId: TEST_CONSTANTS.TENANT_ID,
      clientSecret: TEST_CONSTANTS.CLIENT_SECRET,
    },
    settings: {
      homePageRoute: TEST_CONSTANTS.APP_ROUTE,
      redirectUri: TEST_CONSTANTS.REDIRECT_URI,
      postLogoutRedirectUri: TEST_CONSTANTS.REDIRECT_URI,
    },
  };

  const authApp = new AuthProvider(appSettings);
  expect(authApp).toBeInstanceOf(AuthProvider);
});
