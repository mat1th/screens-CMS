var checkLogin = function(req, res, next) {
    var email = req.session.email;

    if (email === null || email === undefined) {
        req.session.backTo = req.originalUrl;
        res.redirect('/users/login');
    } else {
        req.email = email;
        next();
    }
};

module.exports = checkLogin;
