var express = require('express'),
    saltHash = require('../../modules/saltHash.js'),
    getSpecificData = require('../../modules/getSpecificData.js'),
    insertData = require('../../modules/insertData.js'),
    renderTemplate = require('../../modules/renderTemplate.js'),
    paswordStrength = require('../../modules/paswordStrength.js'),
    router = express.Router();


var setSession = function(req, userId, userName, role) { //set a session for the user
    var hour = 10200000;
    req.session.cookie.expires = new Date(Date.now() + hour);
    req.session.user_id = userId;
    req.session.user_name = userName;
    req.session.role = role;
};

router.get('/login', function(req, res) { //render the login page
    var general = {
            title: 'Login',
            pagelayout: 'transparant'
        },
        postUrls = {
            general: '/users/login'
        };

    renderTemplate(res, req, 'users/login', {}, general, postUrls, false);
});

router.post('/login', function(req, res) { //get the post request for the login page
    var body = req.body,
        email = body.email,
        password = body.password,
        general = {
            title: 'Login',
            pagelayout: 'transparant'
        },
        postUrls = {
            general: '/users/login'
        };

    req.getConnection(function(err, connection) { //setup the connection
        var sql = 'SELECT salt, hash, role, name, id FROM users WHERE email = ?'; //get the salt and so on
        getSpecificData(sql, connection, [email, password]).then(function(rows) {
            if (rows.length > 0) { //if there is data back forn the database
                var credentials = saltHash.check(rows[0].salt, rows[0].hash, password);
                if (credentials) {
                    setSession(req, rows[0].id, rows[0].name, rows[0].role);
                    res.redirect('/admin');
                } else {
                    renderTemplate(res, req, 'users/login', {}, general, postUrls, 'Username or password is false.'); //the hased password is not the same with the password
                }
            } else {
                renderTemplate(res, req, 'users/login', {}, general, postUrls, 'You have filled in a unknown email.'); //only if there is no data back from the database
            }
        }).catch(function(err) {
            throw err;
        });
    });
});

// Load the register page
router.get('/register', function(req, res) { //render the register page
    var general = {
            title: 'Login',
            pagelayout: 'transparant'
        },
        postUrls = {
            general: '/users/register'
        };
    renderTemplate(res, req, 'users/register', {}, general, postUrls, false);
});

// Insert the submitted registration data
router.post('/register', function(req, res) {
    var email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        passwordcheck = req.body.passwordcheck,
        general = {
            title: 'Login',
            pagelayout: 'transparant'
        },
        postUrls = {
            general: '/users/register'
        };

    if (username !== '' && username !== '' && password !== '') { //check if all fileds are checked
        if (password === passwordcheck) { //check if the two passwords are the same antothers send a error that the password is not the same
            paswordStrength(password); //check the password strength
            req.getConnection(function(err, connection) {
                var sqlQuery = 'INSERT INTO users SET name = ?, email = ?, hash = ?, salt = ?';
                var credentials = saltHash.get(password); //create a hash from the password

                insertData(sqlQuery, [username, email, credentials.hash, credentials.salt], connection).then(function() { //insert the data in the database
                    res.redirect('/users/login'); //go tho the login page

                }).catch(function(err) {
                    renderTemplate(res, req, 'users/register', {}, general, postUrls, 'There is a problem with saving your credentials'); //if ther is a error with inserting
                    throw err;
                });
            });
        } else {
          //if the passwords are not the same
            renderTemplate(res, req, 'users/register', {}, general, postUrls, 'The passwords are not the same.');
        }
    } else {
      //if there is a filed empty
        renderTemplate(res, req, 'users/register', {}, general, postUrls, 'Username or pasword are empty.');

    }
});
//if you go to this page delete the session so the user has no acces
router.get('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

module.exports = router;
