const express = require('express');
const mainController = require('../controllers/mainController');

module.exports = (msal) => {
    
    // initialize router
    const router = express.Router();

    // app routes
    router.get('/', (req, res, next) => res.redirect('/home'));
    router.get('/home', mainController.getHomePage);

    // auth routes
    router.get('/signin',
        msal.signIn({
            successRedirect: "/",
            failureRedirect: "/signin"
        }),
    );

    router.get('/signout',
        msal.signOut({
            successRedirect: "/",
        }),
    );

    // secure routes
    router.get('/id',
        msal.isAuthenticated(),
        mainController.getIdPage
    );

    router.get('/profile',
        msal.isAuthenticated(),
        msal.getToken({
            resource: msal.appSettings.remoteResources.graphAPI
        }),
        mainController.getProfilePage
    ); // get token for this route to call web API

    router.get('/tenant',
        msal.isAuthenticated(),
        msal.getToken({
            resource: msal.appSettings.remoteResources.armAPI
        }),
        mainController.getTenantPage
    ); // get token for this route to call web API

    // error
    router.get('/error', (req, res) => res.redirect('/401.html'));

    // unauthorized
    router.get('/unauthorized', (req, res) => res.redirect('/500.html'));

    // 404
    router.get('*', (req, res) => res.redirect('/404.html'));

    return router;
}