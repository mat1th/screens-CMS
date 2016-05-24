var fs = require('fs'),
    express = require('express'),
    moment = require('moment'),
    checklogin = require('../modules/checklogin.js'),
    isValidDate = require('../modules/isValidDate.js'),
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
                    res.render('edit/index', {
                        title: 'Your posters',
                        data: match,
                        error: false,
                        logedin: login
                    });

                } else {
                    res.render('edit/index', {
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

router.get('/posters', function(req, res, next) {
    var login = checklogin(req.session);
    if (login) {
        res.render('edit/posters', {
            title: 'Edit posters',
            postUrl: '/edit/posters',
            error: false,
            logedin: login
        });
    } else {
        res.redirect('/users/login');
    }
});


router.post('/posters', function(req, res) {
    var email = req.session.email,
        body = req.body,
        discription = body.discription,
        duration = body.duration,
        type = body.type,
        date_start = body.date_start,
        date_end = body.date_end,
        now = moment(),
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
                        res.redirect('/edit');
                    });

                } else {
                    var renderData = {
                        title: 'Edit Posters',
                        postUrl: '/edit/posters',
                        logedin: checklogin(req.session),
                        error: 'Something went wrong while uploading your poster photo.'
                    };

                    res.render('edit/posters', renderData);
                }
            });
        });
    } else {
        var renderData = {
            title: 'Edit Posters',
            postUrl: '/edit/posters',
            logedin: checklogin(req.session),
            error: 'You have submit a wrong date'
        };
        res.render('edit/posters', renderData);
    }
});
//
// router.post('/', function(req, res) {
//     var body = req.body;
//
//     //     req.getConnection(function(err, connection) {
//     //         var sql = 'SELECT email, password FROM users WHERE email = ? AND password = ?';
//     //         connection.query(sql, [email, password], function(err, match) {
//     //             if (err) {
//     //                 throw err;
//     //             }
//     //             if (match != '' && match.length > 0) {
//     //                 req.session.email = email;
//     //                 res.redirect('/edit');
//     //             } else {
//     //
//     //                 var data = {
//     //                     error: 'Gebruikersnaam en/of wachtwoord onjuist.',
//     //                     logedin: checklogin(req.session),
//     //                     title: 'Login',
//     //                     postUrl: '/users/login'
//     //                 };
//     //                 res.render('users/login', data);
//     //             }
//     //         });
//     //     });
// });


router.get('/displays', function(req, res, next) {
    if (req.session.email) {
        res.render('edit/displays', {
            title: 'Home',
            logedin: checklogin(req.session),
            data: 'hio'
        });
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;
