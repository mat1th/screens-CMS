var express = require('express'),
    checkLogin = require('../../middleware/checklogin.js'),
    checkRightsAdmin = require('../../middleware/checkRightsAdmin.js'),
    credentials = require('../../../modules/credentials.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', checkLogin, checkRightsAdmin, function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Displays',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
        },
        sql;

    if (general.admin) {
        req.getConnection(function(err, connection) {
            sql = 'SELECT email, name, role,id FROM users';
            // Get the user id using username
            connection.query(sql, function(err, match) {
                if (err) {
                    throw err;
                }
                if (match !== '' && match.length > 0) {
                    renderTemplate(res, 'admin/users/show', {
                        general: match
                    }, general, {}, false);
                } else {
                    renderTemplate(res, 'admin/users/show', {
                        general: match
                    }, general, {}, 'There are no users');
                }
            });
        });
    } else {
        res.redirect('/admin');
    }

});




module.exports = router;
