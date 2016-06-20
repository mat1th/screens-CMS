var checkLogin = function(req, res, next) {
    var userId = req.session.user_id;

    if (userId === null || userId === undefined) { //check if a user id is set if not go to the login page 
        res.redirect('/users/login');
    } else {
        req.userId = userId;
        next();
    }
};

module.exports = checkLogin;
