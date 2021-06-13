const express = require('express');
const mainController = require('../controllers/mainController');

module.exports = (authProvider) => {
    // initialize router
    const router = express.Router();

    // app routes
    router.get('/', (req, res, next) => res.redirect('/home'));
    router.get('/home', mainController.getHomePage);

    // secure routes
    router.get('/id', authProvider.isAuthenticated({
        
    }), mainController.getIdPage);

    router.get('/profile', authProvider.isAuthenticated({}), authProvider.getToken({}), mainController.getProfilePage); // get token for this route to call web API
    router.get('/tenant', authProvider.isAuthenticated, authProvider.getToken({}), mainController.getTenantPage) // get token for this route to call web API

    // 404
    router.get('*', (req, res) => res.status(404).redirect('/404.html'));

    return router;
}