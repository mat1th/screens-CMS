var fs = require('fs'),
    express = require('express'),
    moment = require('moment'),
    credentials = require('../../../modules/credentials.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    router = express.Router();

router.get('/', function(req, res, next) {
    var cr = credentials(req.session),
        login = cr.login,
        email = cr.email,
        admin = cr.admin,
        sql;

    if (login) {
        if (admin) {
            req.getConnection(function(err, connection) {
                sql = 'SELECT email, name, role FROM users';
                // Get the user id using username
                connection.query(sql, function(err, match) {
                    if (err) {
                        throw err;
                    }
                    if (match !== '' && match.length > 0) {
                        res.render('admin/users/show', {
                            title: 'Users',
                            rights: {
                                admin: admin,
                                logedin: login
                            },
                            data: match
                        });
                    } else {
                        res.render('admin/users/show', {
                            title: 'Users',
                            rights: {
                                admin: admin,
                                logedin: login
                            },
                            error: 'You have no displays jet',
                            data: match
                        });
                    }
                });
            });
        } else {
            res.redirect('/admin');
        }
    } else {
        res.redirect('/users/login');
    }
});

router.get('/add', function(req, res, next) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin;

    if (login && admin) {
        res.render('admin/users/add', {
            title: 'Add a poster',
            rights: {
                admin: admin,
                logedin: login
            },
            postUrl: '/admin/slideshows/add',
            error: false
        });
    } else {
        res.redirect('/users/login');
    }

});



module.exports = router;
