/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');

const settings = require('./appSettings');
console.log(settings);
const cache = require('./utils/cachePlugin');

const msalWrapper = require('../../dist/index');

const SERVER_PORT = process.env.PORT || 4000;

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use(express.static(path.join(__dirname, './public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//app.use(helmet());

/**
 * Using express-session middleware. Be sure to familiarize yourself with available options
 * and set the desired options. Visit: https://www.npmjs.com/package/express-session
 */

const sessionConfig = {
    secret: 'ENTER_YOUR_SECRET_HERE',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set this to true on production 
        maxAge: 3600000 // 1 hour
    }
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionConfig.cookie.secure = true // serve secure cookies
}

app.use(session(sessionConfig));

const authProvider = new msalWrapper.AuthProvider(settings, cache);

app.use(authProvider.initialize());

const router = require('./routes/router')(authProvider);

app.use(router);

console.log(app);
app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));