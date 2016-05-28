var express = require('express'),
    moment = require('moment'),
    credentials = require('../../../modules/credentials.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    router = express.Router();


router.get('/', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        email = cr.email,
        admin = cr.admin,
        sql;

    if (login) {
        req.getConnection(function(err, connection) {
            if (admin) {
                sql = 'SELECT filename, type, name, id FROM posters';
            } else {
                sql = 'SELECT filename, type, name, id FROM posters WHERE userId  IN( SELECT id FROM users WHERE email = ? )';
            }
            // Get the user id using username
            connection.query(sql, [email], function(err, match) {
                if (err) {
                    throw err;
                }

                if (match !== '' && match.length > 0) {
                    res.render('admin/posters/show', {
                        title: 'Your posters',
                        admin: admin,
                        data: match,
                        error: false,
                        logedin: login
                    });
                } else {
                    res.render('admin/posters/show', {
                        title: 'Your posters',
                        admin: admin,
                        data: match[0],
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

router.get('/add', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin;

    if (login) {
        res.render('admin/posters/add', {
            title: 'Add a poster',
            admin: admin,
            postUrl: '/admin/posters/add',
            error: false,
            logedin: login
        });
    } else {
        res.redirect('/users/login');
    }
});


// GET a poster and present the full poster page
router.get('/show/:posterId', function(req, res) {
    var posterId = req.params.posterId,
        cr = credentials(req.session),
        login = cr.login,
        email = cr.email,
        admin = cr.admin,
        sql;

    if (login) {
        req.getConnection(function(err, connection, next) {
            if (err) return next(err);
            if (admin) {
                sql = 'SELECT id, name, discription, duration, animation, filename, type, dateStart, dateEnd, dataCreated FROM posters WHERE id = ?';
            } else {
                sql = 'SELECT id, name,discription, duration, animation, filename, type, dateStart, dateEnd, dataCreated FROM posters WHERE id = ? AND userId IN( SELECT id FROM users WHERE email = ? )';
            }
            // Get the photo id and caption using the photo name
            connection.query(sql, [posterId, email], function(err, match) {
                if (err) {
                    throw err;
                } else if (match !== '' && match.length > 0) {
                    var data = {
                        id: match[0].id,
                        discription: match[0].discription,
                        duration: match[0].duration,
                        name: match[0].name,
                        animation: match[0].animation,
                        filename: match[0].filename,
                        type: match[0].type,
                        dateStart: moment(match[0].dateStart).format('LL'),
                        dateEnd: moment(match[0].dateEnd).format('LL'),
                        dataCreated: moment(match[0].dataCreated).startOf('day').fromNow()
                    };
                    res.render('admin/posters/detail', {
                        title: 'Posters',
                        admin: admin,
                        logedin: login,
                        data: data
                    });
                } else {
                    res.send('No such poster: ' + posterId);
                }
            });
        });
    }

});

router.post('/add', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        email = cr.email,
        admin = cr.admin,
        body = req.body,
        name = body.name,
        discription = body.discription,
        duration = body.duration,
        type = body.type,
        dateStart = body.dateStart,
        dateEnd = body.dateEnd,
        now = new Date(),
        upload = req.files;

    if (isValidDate(dateStart) && isValidDate(dateEnd) && login) {
        req.getConnection(function(err, connection) {
            var sql = 'SELECT id FROM users WHERE email = ?';
            // Get the user id using username
            connection.query(sql, [email], function(err, match) {
                if (err) {
                    throw err;
                }

                if (match !== '' && match.length > 0 && upload.imageFile && type !== null) {
                    var sqlQuery = 'INSERT INTO posters SET ?',
                        sqlValues = {
                            userId: match[0].id,
                            name: name,
                            discription: discription,
                            filename: upload.imageFile.name,
                            duration: duration,
                            type: type,
                            dateStart: dateStart,
                            dateEnd: dateEnd,
                            dataCreated: now
                        };

                    // Insert the new photo data
                    connection.query(sqlQuery, sqlValues, function(err, user) {
                        if (err) {
                            throw err;
                        }
                        res.redirect('/admin/posters');
                    });

                } else {
                    var renderData = {
                        title: 'Edit Posters',
                        admin: admin,
                        postUrl: '/admin/posters/add',
                        logedin: login,
                        error: 'Something went wrong while uploading your poster photo.'
                    };

                    res.render('admin/posters/add', renderData);
                }
            });
        });
    } else {
        if (!login) {
            res.redirect('/users/login');
        } else {
            var renderData = {
                title: 'Edit Posters',
                admin: admin,
                postUrl: '/admin/posters/add',
                logedin: login,
                error: 'You have submit a wrong date'
            };
            res.render('admin/posters/add', renderData);
        }
    }
});



module.exports = router;
