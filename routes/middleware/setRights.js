var setRights = function(req, res, next) {
    var role = req.session.role;
    req.admin = false;
    req.editor = false;

    if (role === 'admin') { //set the rigths of the user
        req.admin = true;
        req.editor = true;
    } else if (role === 'editor') {
        req.editor = true;
    }
    next();
};

module.exports = setRights;
