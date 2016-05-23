var fs = require('fs'),
    express = require('express'),
    mysql = require('mysql'),
    paswordStrength = require('../modules/paswordStrength.js'),
    checklogin = require('../modules/checklogin.js'),
    router = express.Router();


router.get('/login', function(req, res, next) {
    var data = {
        error: false,
        logedin: checklogin(req.session),
        title: 'Login',
        postUrl: '/users/login'
    };

    res.render('users/login', data);
});

router.post('/login', function(req, res) {
    var body = req.body,
        email = body.email,
        password = body.password;

    req.getConnection(function(err, connection) {
        var sql = 'SELECT email, password FROM users WHERE email = ? AND password = ?';
        connection.query(sql, [email, password], function(err, match) {
            if (err) {
                throw err;
            }
            if (match != '' && match.length > 0) {
                req.session.email = email;
                res.redirect('/edit');
            } else {

                var data = {
                    error: 'Gebruikersnaam en/of wachtwoord onjuist.',
                    logedin: checklogin(req.session),
                    title: 'Login',
                    postUrl: '/users/login'
                };
                res.render('users/login', data);
            }
        });
    });
});

// Load the register page
router.get('/register', function(req, res) {
    var data = {
        error: false,
        logedin: checklogin(req.session),
        postUrl: '/users/register'
    }
    res.render('users/register', data);
});

// Insert the submitted registration data
router.post('/register', function(req, res) {
    var email = req.body.email,
        username = req.body.username,
        password = req.body.password;

    if (username != '' && username != '' && password != '') {
        paswordStrength(password);
        req.getConnection(function(err, connection) {
            var sqlQuery = 'INSERT INTO users SET ?',
                sqlValues = {
                    name: username,
                    password: password,
                    email: email
                };

            connection.query(sqlQuery, sqlValues, function(err, user) {
                if (err) {
                    throw err;
                }

                res.redirect('/users/login');
            });
        });
    } else {
        var data = {
            postUrl: '/users/register',
            logedin: checklogin(req.session),
            error: 'Gebruikersnaam en/of wachtwoord leeg.'
        }

        res.render('users/register', data);
    }
});
router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    })
})


module.exports = router;
