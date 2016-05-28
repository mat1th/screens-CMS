var express = require('express'),
    // moment = require('moment'),
    credentials = require('../../modules/credentials.js'),
    router = express.Router();

router.get('/', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        email = cr.email,
        sql;

    if (login) {
        req.getConnection(function(err, connection) {
            if (admin) {
                sql = "SELECT (SELECT COUNT(id) FROM posters) AS 'posters', (SELECT COUNT(id) FROM slideshows) AS 'slideshows', (SELECT COUNT(id) FROM displays) AS 'displays'";
            } else {
                sql = "SELECT (SELECT COUNT(id) FROM posters WHERE userId  IN( SELECT id FROM users WHERE email = ? )) AS 'posters', (SELECT COUNT(id) FROM slideshows WHERE userId  IN( SELECT id FROM users WHERE email = ? )) AS 'slideshows'";
            }

            // Get the user id using username
            connection.query(sql, [email, email], function(err, match) {
                if (err) {
                    throw err;
                }
                if (match !== '' && match.length > 0) {
                    res.render('admin/index', {
                        title: 'Dashboard',
                        data: match[0],
                        admin: admin,
                        error: false,
                        logedin: login
                    });
                } else {
                    res.render('admin/index', {
                        title: 'Dashboard',
                        data: match[0],
                        admin: admin,
                        error: 'You have got no posters',
                        logedin: login
                    });
                }
            });
        });
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;
