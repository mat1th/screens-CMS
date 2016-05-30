var express = require('express'),
    credentials = require('../../../modules/credentials.js'),
    // isValidDate = require('../../../modules/isValidDate.js'),
    router = express.Router();

router.get('/', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        sql;

    if (login) {
        if (admin) {
            req.getConnection(function(err, connection) {
                sql = 'SELECT id, name, posters FROM slideshows';
                // Get the user id using username
                connection.query(sql, function(err, match) {
                    if (err) {
                        throw err;
                    }

                    if (match !== '' && match.length > 0) {
                        res.render('admin/slideshows/show', {
                            title: 'Slideshows',
                            rights: {
                                admin: admin,
                                logedin: login
                            },
                            data: match
                        });
                    } else {
                        res.render('admin/slideshows/show', {
                            title: 'Slideshows',
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
router.get('/add', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        sqlPosters, sqlSlideshows;

    if (login) {
        if (admin) {
            req.getConnection(function(err, connection) {
                sqlPosters = 'SELECT filename, type, name, id FROM posters'

                connection.query(sqlPosters, function(err, postersMatch) {
                    if (err) throw err;

                    res.render('admin/slideshows/add', {
                        title: 'Add a poster',
                        data: {
                            posters: postersMatch
                        },
                        rights: {
                            admin: admin,
                            logedin: login
                        },
                        navStyle: 'icons-only',
                        postUrl: '/admin/slideshows/add',
                        error: false
                    });
                });
            });
        } else {
            res.redirect('/admin');
        }
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;
