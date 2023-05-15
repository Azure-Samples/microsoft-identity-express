require('dotenv').config();

const appSettings = {
    authOptions: {
        clientId: process.env.AAD_CLIENT_ID,
        tenantId: process.env.AAD_TENANT_ID,
        clientSecret: process.env.AAD_CLIENT_SECRET
    },
    authRoutes: {
        redirectUri: "/redirect"
    },
    protectedResources: {
        "graph.microsoft.com": {
            scopes: ["User.Read"],
        },
    },
    loggerOptions: {
        loggerCallback: (logLevel, message, containsPii) => {
            if (containsPii) {
                return;
            }

            console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: 3,
    },
}

module.exports = appSettings;
