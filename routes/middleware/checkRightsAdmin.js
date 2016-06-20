var checkRightsAdmin = function(req, res, next) {
    var role = req.session.role;

    if (role === 'admin') { // check if the user is a admin others go to the /admin page 
        next();
    } else {
        res.redirect('/admin');
    }
};

module.exports = checkRightsAdmin;
