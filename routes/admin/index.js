var express = require('express'),
    // moment = require('moment'),
    getSpecificData = require('../../modules/getSpecificData.js'),
    renderTemplate = require('../../modules/renderTemplate.js'),
    credentials = require('../../modules/credentials.js'),
    router = express.Router();

router.get('/', function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Your posters',
            admin: cr.admin,
            login: cr.login,
            email: cr.email
        },
        sql;

    if (general.login) {
        req.getConnection(function(err, connection) {
            if (general.admin) {
                sql = "SELECT (SELECT COUNT(id) FROM posters) AS 'posters', (SELECT COUNT(id) FROM slideshows) AS 'slideshows', (SELECT COUNT(display_id) FROM displays) AS 'displays'";
            } else {
                sql = 'SELECT COUNT(id) AS posters FROM posters WHERE userId IN( SELECT id FROM users WHERE email = ?)';
            }

            getSpecificData(sql, connection, [general.email]).then(function(rows) {
                var data = {
                    general: rows[0]
                };

                //renderTemplate
                renderTemplate(res, 'admin/index', data, general, {}, false);
                //
            }).catch(function(err) {
                throw err;
            });
        });
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;
