var fs = require('fs'),
    express = require('express'),
    checklogin = require('../modules/checklogin.js')
router = express.Router();
router.get('/', function(req, res, next) {
    var login = checklogin(req.session);
    if (login) {
        res.redirect('/edit/posters');
    } else {
        res.redirect('/users/login');
    }
});

router.get('/posters', function(req, res, next) {
    var login = checklogin(req.session);
    if (login) {
        res.render('edit/posters', {
            title: 'Home',
            postUrl: '/edit/posters',
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
        start_date = body.start_date,
        end_date = body.end_date,
        upload = req.files,
        userId;

    req.getConnection(function(err, connection) {
        var sql = 'SELECT id FROM users WHERE email = ?';

        console.log('req.session:', req.session);

        // Get the user id using username
        connection.query(sql, [email], function(err, match) {
            if (err) {
                throw err;
            }

            if (match !== '' && match.length > 0 && upload.imageFile && type !== null) {

                console.log('user:', match);
                user_id = match[0].id;

                var sqlQuery = 'INSERT INTO posters SET ?',
                    sqlValues = {
                        user_id: user_id,
                        discription: discription,
                        filename: upload.imageFile.name,
                        duration: duration,
                        type: type,
                        start_date: start_date,
                        end_date: end_date
                    };

                // Insert the new photo data
                connection.query(sqlQuery, sqlValues, function(err, user) {
                    if (err) {
                        throw err;
                    }

                    res.redirect('/edit/posters');
                });
            } else {
                var renderData = {
                    error: 'Something went wrong while uploading your poster photo.'
                };

                res.render('photos/upload', renderData);
            }
        });
    });
});

router.post('/', function(req, res) {
    var body = req.body;
    //
    //     req.getConnection(function(err, connection) {
    //         var sql = 'SELECT email, password FROM users WHERE email = ? AND password = ?';
    //         connection.query(sql, [email, password], function(err, match) {
    //             if (err) {
    //                 throw err;
    //             }
    //             if (match != '' && match.length > 0) {
    //                 req.session.email = email;
    //                 res.redirect('/edit');
    //             } else {
    //
    //                 var data = {
    //                     error: 'Gebruikersnaam en/of wachtwoord onjuist.',
    //                     logedin: checklogin(req.session),
    //                     title: 'Login',
    //                     postUrl: '/users/login'
    //                 };
    //                 res.render('users/login', data);
    //             }
    //         });
    //     });
});


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
