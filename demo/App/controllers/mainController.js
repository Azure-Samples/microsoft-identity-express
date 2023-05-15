const fetchManager = require('../utils/fetchManager');

exports.getHomePage = (req, res, next) => {
    res.render('home', { isAuthenticated: req.authContext.isAuthenticated(), username: req.authContext.getAccount()?.idTokenClaims?.preferred_username });
}

exports.getIdPage = (req, res, next) => {
    const claims = req.authContext.getAccount() ? {
        name: req.authContext.getAccount().idTokenClaims.name,
        preferred_username: req.authContext.getAccount().idTokenClaims.preferred_username,
        oid: req.authContext.getAccount().idTokenClaims.oid,
        sub: req.authContext.getAccount().idTokenClaims.sub
    } : {};

    res.render('id', { isAuthenticated: req.authContext.isAuthenticated(), claims: claims });
}

exports.getProfilePage = async (req, res, next) => {
    try {
        let accessToken = req.authContext.getCachedTokenForResource("graph.microsoft.com");

        if (!accessToken) {
            const tokenResponse = await req.authContext.acquireToken({
                scopes: ["User.Read"],
                account: req.authContext.getAccount(),
            })(req, res, next);

            accessToken = tokenResponse.accessToken;
        }

        const profile = await fetchManager.callAPI("https://graph.microsoft.com/v1.0/me", accessToken);
        res.render('profile', { isAuthenticated: req.authContext.isAuthenticated(), profile: profile });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getTenantPage = async (req, res, next) => {
    try {
        const tokenResponse = await req.authContext.acquireToken({
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

exports.getRoles = async (req, res, next) => {
    res.render('roles', { isAuthenticated: req.authContext.isAuthenticated() });   
}

exports.getGroups = async (req, res, next) => {
    res.render('groups', { isAuthenticated: req.authContext.isAuthenticated() });
};