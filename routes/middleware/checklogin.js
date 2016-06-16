var checkLogin = function(req, res, next) {
    var userId = req.session.user_id;

    if (userId === null || userId === undefined) {
        res.redirect('/users/login');
    } else {
        req.userId = userId;
        next();
    }
};

module.exports = checkLogin;
