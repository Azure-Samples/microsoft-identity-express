/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const session = require('express-session');
const path = require('path');

const MsalExpress = require('../../dist/index');
const appSettings = require('./appSettings');

const router = require('./routes/router');

const SERVER_PORT = process.env.PORT || 4000;

async function main() {
    const app = express();

    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'ejs');

    app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
    app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

    app.use(express.static(path.join(__dirname, './public')));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    /**
     * Using express-session middleware. Be sure to familiarize yourself with available options
     * and set the desired options. Visit: https://www.npmjs.com/package/express-session
     */
    const sessionConfig = {
        secret: 'ENTER_YOUR_SECRET_HERE',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, 
        }
    }

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        sessionConfig.cookie.secure = true // serve secure cookies
    }

    app.use(session(sessionConfig));

    // try {
    //     // async building the wrapper as fetching credentials from key vault
    //     const msal = await new MsalExpress.WebAppMiddlewareBuilder(appSettings)
    //         .withKeyVaultCredentials({
    //             credentialType: "clientSecret",
    //             credentialName: "WrapperExampleSecret",
    //             keyVaultUrl: "https://derisen-test-vault.vault.azure.net/"
    //         }).buildAsync();

    //     app.use(msal.initialize());

    //     app.use(router(msal));

    //     app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}!`));
    // } catch (error) {
    //     console.log(error);
    // }

    new MsalExpress.WebAppMiddlewareBuilder(appSettings)
        .build()
        .then(msal => {
            console.log("msal", msal);
            app.use(msal.initialize());
            app.use(router(msal));
            app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}!`));
        }).catch(error => {
            console.log(error);
        })
}

main();
