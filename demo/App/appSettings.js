require('dotenv').config();

const appSettings = {
    appCredentials: {
        clientId: process.env.AAD_CLIENT_ID,
        tenantId: process.env.AAD_TENANT_ID,
        clientSecret: process.env.AAD_CLIENT_SECRET
    },
    authRoutes: {
        redirectUri: "/redirect"
    },
    protectedResources: {
        "graph.microsoft.com": {
            scopes: ["User.Read", "mail.Read", "Calendars.Read"],
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
    systemOptions: {
        proxyUrl: "http://localhost:8888",
    }
}

module.exports = appSettings;
