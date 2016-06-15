var checkRightsAdmin = function(req, res, next) {
    var role = req.session.role;

    if (role === 'editor' || role === 'admin') {
        next();
    } else {
        res.redirect('/admin');
    }
};

module.exports = checkRightsAdmin;
