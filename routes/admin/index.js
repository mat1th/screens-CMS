var express = require('express'),
    checkLogin = require('../middleware/checklogin.js'),
    getSpecificData = require('../../modules/getSpecificData.js'),
    renderTemplate = require('../../modules/renderTemplate.js'),
    credentials = require('../../modules/credentials.js'),
    router = express.Router();

router.get('/', checkLogin, function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Your content',
            admin: cr.admin,
            editor: cr.editor,
            login: cr.login,
            email: cr.email
        },
        sql;


    req.getConnection(function(err, connection) {
        if (general.admin) {
            sql = "SELECT (SELECT COUNT(id) FROM content) AS 'content', (SELECT COUNT(id) FROM content WHERE checked = 0) AS 'uncheckedContent', (SELECT COUNT(id) FROM slideshows) AS 'slideshows', (SELECT COUNT(display_id) FROM displays) AS 'displays'";
        } else {
            sql = 'SELECT COUNT(id) AS content FROM content WHERE userId IN( SELECT id FROM users WHERE email = ?)';
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

});

module.exports = router;
