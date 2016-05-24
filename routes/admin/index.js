var fs = require('fs'),
    express = require('express'),
    moment = require('moment'),
    checklogin = require('../../modules/checklogin.js'),
    isValidDate = require('../../modules/isValidDate.js'),
    router = express.Router();

router.get('/', function(req, res, next) {
    var login = checklogin(req.session);
    if (login) {
        req.getConnection(function(err, connection) {
            var sql = 'SELECT filename, type, id FROM posters WHERE user_id  IN( SELECT id FROM users WHERE email = ? )';
            var email = req.session.email;
            // Get the user id using username
            connection.query(sql, [email], function(err, match) {
                if (err) {
                    throw err;
                }
                if (match !== '' && match.length > 0) {
                    res.render('admin/index', {
                        title: 'Your posters',
                        data: match,
                        error: false,
                        logedin: login
                    });

                } else {
                    res.render('admin/index', {
                        title: 'Your posters',
                        data: match[0],
                        error: 'You have got no posters',
                        logedin: login
                    });
                    //error
                }
            });
        });
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;
