const express = require('express');
const mainController = require('../controllers/mainController');

// initialize router
const router = express.Router();

// app routes
router.get('/', (req, res, next) => {
    res.redirect('/home')
});

router.get('/home', mainController.getHomePage);

// auth routes
router.get(
    '/signin',
    (req, res, next) => {
        return req.authContext.signIn({
            postLoginRedirectUri: "/",
            postFailureRedirectUri: "/signin"
        })(req, res, next);
    }
);

router.get(
    '/signout',
    (req, res, next) => {
        return req.authContext.signOut({
            postLogoutRedirectUri: "/",
        })(req, res, next);
    }
);

// secure routes
router.get(
    '/id',
    mainController.getIdPage
);

router.get(
    '/profile',
    mainController.getProfilePage
); // get token for this route to call web API

router.get(
    '/tenant',
    mainController.getTenantPage
); // get token for this route to call web API

// unauthorized
router.get('/unauthorized', (req, res) => res.redirect('/401.html'));

// 404
router.get('*', (req, res) => res.redirect('/404.html'));

module.exports = router;
