var fs = require('fs'),
    express = require('express'),
    moment = require('moment'),
    checklogin = require('../../../modules/checklogin.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    router = express.Router();


router.get('/', function(req, res, next) {

    var login = checklogin(req.session);
    if (login) {
        req.getConnection(function(err, connection) {
            var sql = 'SELECT filename, type, name, id FROM posters WHERE user_id  IN( SELECT id FROM users WHERE email = ? )';
            var email = req.session.email;
            // Get the user id using username
            connection.query(sql, [email], function(err, match) {
                if (err) {
                    throw err;
                }

                if (match !== '' && match.length > 0) {
                    res.render('admin/posters/show', {
                        title: 'Your posters',
                        data: match,
                        error: false,
                        logedin: login
                    });
                } else {
                    res.render('admin/posters/show', {
                        title: 'Your posters',
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


router.get('/add', function(req, res, next) {
    var login = checklogin(req.session);
    if (login) {
        res.render('admin/posters/add', {
            title: 'Add a poster',
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
    req.getConnection(function(err, connection) {
        if (err) return next(err);
        var posterId = req.params.posterId;

        var sql = 'SELECT id, name,discription, duration, animation, filename, type, date_start, date_end, date_created FROM posters WHERE id = ?';

        // Get the photo id and caption using the photo name
        connection.query(sql, [posterId], function(err, match) {
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
                    date_begin: moment(match[0].date_begin).format('LL'),
                    date_end: moment(match[0].date_end).format('LL'),
                    date_created: moment(match[0].date_created).startOf('day').fromNow()
                }
                res.render('admin/posters/detail', {
                    title: 'Posters',
                    logedin: checklogin(req.session),
                    data: data
                });
            } else {
                res.send('No such poster: ' + posterId);
            }
        });
    });
});

router.post('/add', function(req, res) {
    var email = req.session.email,
        body = req.body,
        name = body.name,
        discription = body.discription,
        duration = body.duration,
        type = body.type,
        date_start = body.date_start,
        date_end = body.date_end,
        now = new Date(),
        upload = req.files;

    if (isValidDate(date_start) && isValidDate(date_end)) {
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
                            user_id: match[0].id,
                            name: name,
                            discription: discription,
                            filename: upload.imageFile.name,
                            duration: duration,
                            type: type,
                            date_start: date_start,
                            date_end: date_end,
                            date_created: now
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
                        postUrl: '/admin/posters/add',
                        logedin: checklogin(req.session),
                        error: 'Something went wrong while uploading your poster photo.'
                    };

                    res.render('admin/posters/add', renderData);
                }
            });
        });
    } else {
        var renderData = {
            title: 'Edit Posters',
            postUrl: '/admin/posters/add',
            logedin: checklogin(req.session),
            error: 'You have submit a wrong date'
        };
        res.render('admin/posters/add', renderData);
    }
});



module.exports = router;
