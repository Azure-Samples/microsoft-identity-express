/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
  AccountInfo,
  AuthorizationUrlRequest,
  AuthorizationCodeRequest,
} from "@azure/msal-node";

declare module "express-session" {
  interface SessionData {
    authCodeRequest: AuthorizationUrlRequest;
    tokenRequest: AuthorizationCodeRequest;
    account: AccountInfo;
    nonce: string;
    isAuthenticated?: boolean;
    resources: {
      [resource: string]: Resource;
    };
    services: {
      [service: string]: Service;
    }
  }
}

export type AuthCodeParams = {
  authority: string;
  scopes: string[];
  state: string;
  redirect: string;
  prompt?: string;
  account?: AccountInfo;
};

export type InitializationOptions = {

}

export type MiddlewareOptions = {

}

export type ValidationOptions = {
  audience: string;
  issuer: string;
  scope: string;
};

export type State = {
  nonce: string;
  stage: string;
};

export type AppSettings = {
  credentials: Credentials;
  settings: Settings;
  policies?: {
    [policy: string]: Policy;
  };
  resources?: {
    [resource: string]: Resource;
  };
  services?: {
    [service: string]: Service
  },
  accessMatrix?: {
    [accessRule: string]: AccessRule
  }
};

export type Credentials = {
  clientId: string;
  tenantId: string;
  clientSecret?: string;
  clientCertificate?: ClientCertificate;
};

export type ClientCertificate = {
  thumbprint: string;
  privateKey: string;
};

export type Settings = {
  homePageRoute: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
};

export type Service = {
  endpoint: string,
  scopes: string[]
}

export type Resource = {
  callingPageRoute: string;
  endpoint: string;
  scopes: string[];
  accessToken?: string;
};

export type Policy = {
  authority: string;
};

export type AccessRule = {
  path: string,
  methods: string[],
  roles: string[]
}

export type UserInfo = {
  businessPhones?: Array<string>;
  displayName?: string;
  givenName?: string;
  id?: string;
  jobTitle?: string;
  mail?: string;
  mobilePhone?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  surname?: string;
  userPrincipalName?: string;
};


// export type AppSettings2 = {
//   appCredentials: Credentials;
//   authRoutes: Settings;
//   b2cPolicies?: {
//     [policy: string]: Policy;
//   };
//   protectedResources?: {
//     [resource: string]: Resource;
//   };
//   ownedResources?: {
//     [service: string]: Service
//   },
//   accessMatrix?: {
//     [accessRule: string]: AccessRule
//   }
// };

// export type AppCredentials = {
//   clientId: string;
//   tenantId: string;
//   clientSecret?: string;
//   clientCertificate?: ClientCertificate;
//   keyVault?: KeyVault
// }

// export type KeyVault = {
//   credentialType: string,
//   credentialName: string
//   keyVaultUrl: string,
// }

// export type AuthRoutes = {
//   redirect: "/redirect",
//   login: "/signin",
//   logout: "/signout",
//   postLogout?: "/",
//   frontChannelLogout?: "/ssout",
//   error: "/error",
//   unauthorized: "/unauthorized",
// }

// export type remoteResource = {
//   callingPageRoute: string;
//   endpoint: string;
//   scopes: string[];
//   accessToken?: string;
// }

// export type ownedResource = {
//   endpoint: string;
//   scopes: string[];
// }