var express = require('express'),
    getSpecificData = require('../../modules/getSpecificData.js'),
    insertData = require('../../modules/insertData.js'),
    renderTemplate = require('../../modules/renderTemplate.js'),
    paswordStrength = require('../../modules/paswordStrength.js'),
    router = express.Router();


router.get('/login', function(req, res) {
    var general = {
            title: 'Login',
            navPosition: 'transparant'
        },
        postUrls = {
            general: '/users/login'
        };
    renderTemplate(res, 'users/login', {}, general, postUrls, false);
});

router.post('/login', function(req, res) {
    var body = req.body,
        email = body.email,
        password = body.password,
        hour = 3600000,
        general = {
            title: 'Login',
            navPosition: 'transparant'
        },
        postUrls = {
            general: '/users/login'
        };

    req.getConnection(function(err, connection) {
        var sql = 'SELECT email, password, role FROM users WHERE email = ? AND password = ?';
        getSpecificData(sql, connection, [email, password]).then(function(rows) {
            if (rows.length > 0) {
                req.session.cookie.expires = new Date(Date.now() + hour);
                req.session.email = email;
                req.session.role = rows[0].role;
                res.redirect('/admin');
            } else {
                renderTemplate(res, 'users/login', {}, general, postUrls, 'Gebruikersnaam en/of wachtwoord onjuist.');
            }
        }).catch(function(err) {
            throw err;
        });
    });
});

// Load the register page
router.get('/register', function(req, res) {
    var general = {
            title: 'Login',
            navPosition: 'transparant'
        },
        postUrls = {
            general: '/users/register'
        };
    renderTemplate(res, 'users/register', {}, general, postUrls, false);
});

// Insert the submitted registration data
router.post('/register', function(req, res) {
    var email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        passwordcheck = req.body.passwordcheck,
        general = {
            title: 'Login',
            navPosition: 'transparant'
        },
        postUrls = {
            general: '/users/register'
        };

    if (username !== '' && username !== '' && password !== '') {
        if (password === passwordcheck) {
            paswordStrength(password);
            req.getConnection(function(err, connection) {
                var sqlQuery = 'INSERT INTO users SET name = ?, email = ?, password = ?';

                insertData(sqlQuery, [username, password, email], connection).then(function() {
                    res.redirect('/users/login');

                }).catch(function(err) {
                    renderTemplate(res, 'users/register', {}, general, postUrls, 'There is a problem with saving your credentials');

                    throw err;
                });
            });
        } else {
            renderTemplate(res, 'users/register', {}, general, postUrls, 'The passwords are not the same.');
        }
    } else {
        renderTemplate(res, 'users/register', {}, general, postUrls, 'Username or pasword are empty.');

    }
});

router.get('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

module.exports = router;
