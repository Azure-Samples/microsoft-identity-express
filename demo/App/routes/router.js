const express = require('express');
const mainController = require('../controllers/mainController');

const appSettings = require('../appSettings.js');
const { performance } = require('perf_hooks');

module.exports = (msid) => {
    // initialize router
    const router = express.Router();

    // app routes
    router.get('/', (req, res, next) => {
        if (req.session && req.session.isAuthenticated) {
            performance.mark('signIn-end');
            performance.measure('signIn', 'signIn-start', 'signIn-end');
        }
        res.redirect('/home');
    });
    router.get('/home', mainController.getHomePage);

    // auth routes
    router.get(
        '/signin',
        (req, res, next) => {
            performance.mark('signIn-start');
            next();
        },
        msid.signIn({
            postLoginRedirect: '/',
            failureRedirect: '/signin',
        })
    );

    router.get(
        '/signout',
        msid.signOut({
            postLogoutRedirect: '/',
        })
    );

    // secure routes
    router.get('/id', msid.isAuthenticated(), mainController.getIdPage);

    router.get(
        '/profile',
        msid.isAuthenticated(),
        (req, res, next) => {
            performance.mark('fetch-token-graph-start');
            next();
        },
        msid.getToken({
            resource: msid.appSettings.protectedResources.graphAPI,
        }),
        (req, res, next) => {
            performance.mark('fetch-token-graph-end');
            performance.measure('fetch-token-graph', 'fetch-token-graph-start', 'fetch-token-graph-end');
            next();
        },
        mainController.getProfilePage
    ); // get token for this route to call web API

    router.get(
        '/tenant',
        msid.isAuthenticated(),
        (req, res, next) => {
            performance.mark('fetch-token-azure-management-start');
            next();
        },
        msid.getToken({
            resource: msid.appSettings.protectedResources.armAPI,
        }),
        (req, res, next) => {
            performance.mark('fetch-token-azure-management-end');
            performance.measure(
                'fetch-token-azure-management',
                'fetch-token-azure-management-start',
                'fetch-token-azure-management-end'
            );
            next();
        },
        mainController.getTenantPage
    ); // get token for this route to call web API

    router.use(
        '/groups',
        msid.isAuthenticated(),
        (req, res, next) => {
            performance.mark('test-access-control-groups-start');
            next();
        },
        msid.hasAccess({
            accessRule: appSettings.accessMatrix.groupsTodoList,
        }),
        (req, res, next) => {
            performance.mark('test-access-control-groups-end');
            performance.measure(
                'test-access-control-groups',
                'test-access-control-groups-start',
                'test-access-control-groups-end'
            );
            next();
        },
        mainController.getGroups
    );

    router.use(
        '/roles',
        msid.isAuthenticated(),
        (req, res, next) => {
            performance.mark('test-access-control-roles-start');
            next();
        },
        msid.hasAccess({
            accessRule: appSettings.accessMatrix.rolesTodolist,
        }),
        (req, res, next) => {
            performance.mark('test-access-control-roles-end');
            performance.measure(
                'test-access-control-roles',
                'test-access-control-roles-start',
                'test-access-control-roles-end'
            );
            next();
        },
        mainController.getRoles
    );

    // unauthorized
    router.get('/unauthorized', (req, res) => res.redirect('/401.html'));

    // 404
    router.get('*', (req, res) => res.redirect('/404.html'));

    return router;
};
