/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const session = require('express-session');
const path = require('path');

const router = require('./routes/router');

const SERVER_PORT = process.env.PORT || 4000;

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use(express.static(path.join(__dirname, './public')));

app.use(express.urlencoded({ extended: false }));

/**
 * Using express-session middleware. Be sure to familiarize yourself with available options
 * and set the desired options. Visit: https://www.npmjs.com/package/express-session
 */
app.use(session({ secret: 'ENTER_YOUR_SECRET_HERE', resave: false, saveUninitialized: false }));


/**
 * Configure routes and middleware
 */

const appSettings = {
    appCredentials: {
        clientId: "Enter_the_Application_Id_Here",
        tenantId: "Enter_the_Tenant_Info_Here",
        clientSecret: "Enter_the_Client_Secret_Here",
    },
    authConfiguration: {
        cachePlugin: "",
        loglevel: "",
    },
    authRoutes: {
        redirect: "/redirect",
        login: "/signin",
        logout: "/signout",
        postLogout: "/",
        frontChannelLogout: "/ssout",
        error: "/error",
        unauthorized: "/unauthorized",
    },
    protectedResources: {
        graphAPI: {
            callingPageRoute: "/profile",
            endpoint: "https://graph.microsoft.com/v1.0/me",
            scopes: ["user.read"]
        },
        armAPI: {
            callingPageRoute: "/tenant",
            endpoint: "https://management.azure.com/tenants?api-version=2020-01-01",
            scopes: ["https://management.azure.com/user_impersonation"]
        }
    },
    ownedResources: {
        obo: {
            endpoint: "",
            scopes: []
        }
    }
}

const authProvider = new msalWrapper.AuthProvider(appSettings, cache);

app.use(
    authProvider.initialize({
        useSession: true,
        saveCacheToDisk: true,
        customState: {}
    })
);

// initialize router
const router = express.Router();

// app routes
router.get('/', (req, res, next) => res.redirect('/home'));
router.get('/home', mainController.getHomePage);

// secure routes
router.get('/id', 
    authProvider.isAuthenticated({
        redirectTo: "/signin",
        checkCredentials: true
    }),
    mainController.getIdPage
);

router.get('/profile', 
    authProvider.isAuthenticated, 
    authProvider.getToken({
        someSetting: false
    }), 
    mainController.getProfilePage
); // get token for this route to call web API

app.use(router);

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));