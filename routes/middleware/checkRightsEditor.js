var checkRightsAdmin = function(req, res, next) {
    var role = req.session.role;

    if (role === 'editor' || role === 'admin') { //check if the user is a admin or a editor others return to the /adim page 
        next();
    } else {
        res.redirect('/admin');
    }
};

module.exports = checkRightsAdmin;
