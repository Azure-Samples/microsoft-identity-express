const appSettings = {
    appCredentials: {
        clientId: "2a47e38d-600d-41c0-9d88-518326c9e4d7",
        tenantId: "cbaf2168-de14-4c72-9d88-f5f05366dbef",
        keyVaultCredential: {
            credentialType: "secret",
            credentialName: "WrapperExampleSecret",
            keyVaultUrl: "https://derisen-test-vault.vault.azure.net/"
        }
    },
    authRoutes: {
        redirect: "/redirect",
        error: "/error",
        unauthorized: "/unauthorized"
    },
    remoteResources: {
        graphAPI: {
            endpoint: "https://graph.microsoft.com/v1.0/me",
            scopes: ["user.read"]
        },
        armAPI: {
            endpoint: "https://management.azure.com/tenants?api-version=2020-01-01",
            scopes: ["https://management.azure.com/user_impersonation"]
        }
    }
}

module.exports = appSettings;