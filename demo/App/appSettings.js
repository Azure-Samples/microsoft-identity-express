require('dotenv').config();

const appSettings = {
    appCredentials: {
        clientId: process.env.AAD_CLIENT_ID,
        tenantId: process.env.AAD_TENANT_ID,
        // clientSecret: process.env.AAD_CLIENT_SECRET,
    },
    authRoutes: {
        redirect: '/redirect',
        unauthorized: '/unauthorized',
    },
    // b2cPolicies: {
    //     signUpSignIn: {
    //         authority: process.env.B2C_AUTHORITY,
    //     },
    // },
    protectedResources: {
        graphAPI: {
            endpoint: 'https://graph.microsoft.com/v1.0/me',
            scopes: ['user.read'],
        },
        armAPI: {
            endpoint: 'https://management.azure.com/tenants?api-version=2020-01-01',
            scopes: ['https://management.azure.com/user_impersonation'],
        },
    },
    accessMatrix: {
        rolesTodolist: {
            methods: ['GET'],
            roles: ['TaskUser', 'TaskAdmin'],
        },
        groupsTodoList: {
            methods: ['GET'],
            groups: ['Enter_the_Object_Id_of_Your_Group_Here'],
        },
    },
};

module.exports = appSettings;
