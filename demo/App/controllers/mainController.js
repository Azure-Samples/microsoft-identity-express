const fetchManager = require('../utils/fetchManager');
const appSettings = require('../appSettings');

exports.getHomePage = (req, res, next) => {
    res.render('home', { isAuthenticated: req.session.isAuthenticated, username: req.session.account?.idTokenClaims?.preferred_username });
}

exports.getIdPage = (req, res, next) => {
    const claims = req.session.account ? {
        name: req.session.account.idTokenClaims.name,
        preferred_username: req.session.account.idTokenClaims.preferred_username,
        oid: req.session.account.idTokenClaims.oid,
        sub: req.session.account.idTokenClaims.sub
    } : {};

    res.render('id', { isAuthenticated: req.session.isAuthenticated, claims: claims });
}

exports.getProfilePage = async (req, res, next) => {
    try {
        const tokenResponse = await req.authContext.getToken({
            scopes: ["user.Read"],
            account: req.authContext.getAccount(),
        })(req, res, next);

        const profile = await fetchManager.callAPI("https://graph.microsoft.com/v1.0/me", tokenResponse.accessToken);
        return res.render('profile', { isAuthenticated: req.authContext.isAuthenticated(), profile: profile });
    } catch (error) {
        return next(error);
    }
}

exports.getTenantPage = async (req, res, next) => {
    try {
        const tokenResponse = await req.authContext.getToken({
            scopes: ["https://management.azure.com/user_impersonation"],
            account: req.authContext.getAccount(),
        })(req, res, next);

        const tenant = await fetchManager.callAPI("https://management.azure.com/tenants?api-version=2020-01-01", tokenResponse.accessToken);
        res.render('tenant', { isAuthenticated: req.authContext.isAuthenticated(), tenant: tenant.value[0] });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
