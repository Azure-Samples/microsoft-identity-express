/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { WebAppAuthProvider } = require('../../dist/index');
const appSettings = require('./appSettings');
const router = require('./routes/router');

const app = express();

async function main() {

    /**
     * Using express-session middleware. Be sure to familiarize yourself with available options
     * and set the desired options. Visit: https://www.npmjs.com/package/express-session
     */
    app.use(session({
        secret: 'ENTER_YOUR_SECRET_HERE',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
        }
    }));

    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'ejs');

    app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
    app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

    app.use(express.static(path.join(__dirname, './public')));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Apply the rate limiting middleware to all requests
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    }));

    app.set('trust proxy', 1) // trust first proxy

    // building the identity-express-wrapper
    const msid = await WebAppAuthProvider.initialize(appSettings);

    app.use(msid.authenticate({
        protectAllRoutes: false,
        useSession: true,
    }));

    app.get('/id', msid.guard({
        forceLogin: true,
        // idTokenClaims: {
        //     'roles': ['some_role']
        // }
    }));

    app.use(router);

    app.use(msid.interactionErrorHandler());

    app.listen(3000, () => {
        console.log('App listening on port 3000');
    });
}

main();

module.exports = app;
