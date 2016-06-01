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
});
router.get('/add', function(req, res) {
    res.redirect('/admin/slideshows/add/' + randNumber());
});
router.get('/add/:slideshowId', function(req, res) {
    var cr = credentials(req.session),
        slideshowId = req.params.slideshowId,
        login = cr.login,
        admin = cr.admin;

    if (login && admin) {
        req.getConnection(function(err, connection) {
            var sqlPosters = 'SELECT filename, type, name, animation, duration, dateStart,dateEnd, id FROM posters';
            connection.query(sqlPosters, function(err, allPosters) {
                if (err) throw err;

                var sqlSlideshows = 'SELECT posters, id, name, discription FROM slideshows WHERE id = ?';
                connection.query(sqlSlideshows, [slideshowId], function(err, slideshowMatch) {
                    if (err) throw err;

                    var displaySql = 'SELECT id, name FROM displays';
                    // Get the user id using username
                    connection.query(displaySql, function(err, displayMatch) {
                        if (err) throw err;

                        if (slideshowMatch !== '' && slideshowMatch.length > 0) {
                            var AllPosters = JSON.parse(slideshowMatch[0].posters),
                                slideshowSettings = {
                                    id: slideshowMatch[0].id,
                                    name: slideshowMatch[0].name,
                                    discription: slideshowMatch[0].discription
                                },
                                usedposters = [];
                            AllPosters.forEach(function(singlePoster) {
                                allPosters.forEach(function(poster) {
                                    if (singlePoster === poster.id) {
                                        usedposters.push(poster);
                                    }
                                });
                            });
                            renderPage(usedposters, allPosters, slideshowSettings, displayMatch);
                        } else {
                            renderPage(null, allPosters, null, displayMatch);
                        }
                    });
                });
            });
        });
    } else {
        res.redirect('/admin');
    }

    function renderPage(usedposters, allPosters, slideshowSettings, displayMatch) {
        res.render('admin/slideshows/add', {
            title: 'Add a poster',
            data: {
                usedposters: usedposters || null,
                allPosters: allPosters,
                displays: displayMatch,
                slideshowSettings: slideshowSettings || null
            },
            rights: {
                admin: admin,
                logedin: login
            },
            navStyle: 'icons-only',
            postUrl: {
                settings: '/admin/slideshows/add',
                posters: '/admin/posters/add',
                displays: '/admin/posters/add'
            },
            error: false

        });
    }
});

router.post('/add/:slideshowId', function(req, res) {
    var cr = credentials(req.session),
        slideshowId = req.params.slideshowId,
        admin = cr.admin,
        email = cr.email,
        // admin = cr.admin,
        body = req.body,
        posters = '[' + body.posters + ']',
        sqlQuery;
    if (admin) {
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
    } else {
        res.redirect('/admin');
    }
});

module.exports = router;
