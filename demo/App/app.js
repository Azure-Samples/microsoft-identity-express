/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const session = require('express-session');
const path = require('path');

const MsIdExpress = require('../../dist/index');
const appSettings = require('./appSettings');

const router = require('./routes/router');

const SERVER_PORT = process.env.PORT || 4000;

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
app.use(session({
    secret: 'ENTER_YOUR_SECRET_HERE',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
    }
}));
    
app.set('trust proxy', 1) // trust first proxy

// building the identity-express-wrapper 
const msid = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();

app.use(msid.initialize());

app.use(router(msid));

app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}!`));
