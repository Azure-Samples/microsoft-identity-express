require('dotenv').config();

const appSettings = {
    appCredentials: {
        clientId: process.env.AAD_CLIENT_ID,
        tenantId: process.env.AAD_TENANT_ID,
        clientSecret: process.env.AAD_CLIENT_SECRET
    },
    loggerOptions: {
        loggerCallback: (logLevel, message, containsPii) => {
            if (containsPii) {
                return;
            }
            console.log(message);
        },
        piiLoggingEnabled: true,
        logLevel: 4,
    },
    authRoutes: {
        redirect: "/redirect",
        unauthorized: "/unauthorized"
    },
    protectedResources: {
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
