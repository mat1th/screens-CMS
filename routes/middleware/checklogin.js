var checkLogin = function(req, res, next) {
    var email = req.session.email;

    if (email === null || email === undefined) {
        res.redirect('/users/login');
    } else {
        req.email = email;
        next();
    }
};

module.exports = checkLogin;
