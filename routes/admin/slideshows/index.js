var express = require('express'),
    credentials = require('../../../modules/credentials.js'),
    randNumber = require('../../../modules/randNumber.js'),
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
    res.redirect('/admin/slideshows/add/' + randNumber());
});
router.get('/add/:slideshowId', function(req, res) {
    var cr = credentials(req.session),
        slideshowId = req.params.slideshowId,
        login = cr.login,
        admin = cr.admin,
        newPosters = [],
        oldPosters = [];


    if (login) {
        if (admin) {
            req.getConnection(function(err, connection) {
                var sqlPosters = 'SELECT filename, type, name, id FROM posters';
                var sqlSlideshows = 'SELECT posters, id, name FROM slideshows WHERE id = ?';

                connection.query(sqlPosters, function(err, postersMatch) {
                    if (err) throw err;
                    connection.query(sqlSlideshows, [slideshowId], function(err, slideshowsMatch) {
                        if (err) throw err;
                        if (slideshowsMatch !== '' && slideshowsMatch.length > 0) {
                            var posters = JSON.parse(slideshowsMatch[0].posters);
                            posters.forEach(function(posterID) {
                                postersMatch.forEach(function(value) {
                                    if (posterID === value.id) {
                                        // console.log();
                                        oldPosters.push(value);
                                    } else {
                                        newPosters.push(value);
                                    }

                                });
                            });
                            res.render('admin/slideshows/add', {
                                title: 'Add a poster',
                                data: {
                                    posters: newPosters,
                                    oldPosters: oldPosters
                                },
                                rights: {
                                    admin: admin,
                                    logedin: login
                                },
                                navStyle: 'icons-only',
                                postUrl: '/admin/slideshows/add',
                                error: false
                            });
                        }
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

router.post('/add/:slideshowId', function(req, res) {
    var cr = credentials(req.session),
        slideshowId = req.params.slideshowId,
        login = cr.login,
        email = cr.email,
        // admin = cr.admin,
        body = req.body,
        posters = '[' + body.posters + ']',
        sqlQuery;
    if (login) {

        req.getConnection(function(err, connection) {
            var sql = 'SELECT id FROM users WHERE email = ?';
            connection.query(sql, [email], function(err, matchUser) {
                if (err) throw err;

                if (matchUser !== '' && matchUser.length > 0) {
                    var sqlSlideshows = 'SELECT id FROM slideshows WHERE id = ?';
                    connection.query(sqlSlideshows, [slideshowId], function(err, match) {
                        if (err) throw err;
                        if (match !== '' && match.length === 0) {
                            var sqlValues = {
                                id: slideshowId,
                                userId: matchUser[0].id,
                                posters: posters
                            };
                            sqlQuery = 'INSERT INTO slideshows SET ?';

                            connection.query(sqlQuery, sqlValues, function(err) {
                                if (err) {
                                    throw err;
                                }
                                res.send('done');
                            });

                        } else {
                            sqlQuery = 'UPDATE slideshows SET posters = ? WHERE id= ?';
                            connection.query(sqlQuery, [posters, match[0].id], function(err) {
                                if (err) throw err;
                                res.send('done');
                            });
                        }
                    });
                }
            });
        });
    }
});

module.exports = router;
