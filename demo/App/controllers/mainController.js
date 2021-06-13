const fetchManager = require('../utils/fetchManager');
const appSettings = require('../appSettings');

exports.getHomePage = (req, res, next) => {
    res.render('home', { isAuthenticated: req.session.isAuthenticated });
}

exports.getIdPage = (req, res, next) => {
    const claims = {
        name: req.session.account.idTokenClaims.name,
        preferred_username: req.session.account.idTokenClaims.preferred_username,
        oid: req.session.account.idTokenClaims.oid,
        sub: req.session.account.idTokenClaims.sub
    };

    res.render('id', { isAuthenticated: req.session.isAuthenticated, claims: claims });
}

exports.getProfilePage = async(req, res, next) => {
    let profile;

    try {
        profile = await fetchManager.callAPI(appSettings.remoteResources.graphAPI.endpoint, req.session.remoteResources["graphAPI"].accessToken);        
    } catch (error) {
        console.log(error)
    }

    res.render('profile', { isAuthenticated: req.session.isAuthenticated, profile: profile });
}

exports.getTenantPage = async(req, res, next) => {
    let tenant;

    try {
        tenant = await fetchManager.callAPI(appSettings.remoteResources.armAPI.endpoint, req.session.remoteResources["armAPI"].accessToken);   
    } catch (error) {
        console.log(error)
    }

    res.render('tenant', { isAuthenticated: req.session.isAuthenticated, tenant: tenant.value[0] });
}