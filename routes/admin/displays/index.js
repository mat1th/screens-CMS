var fs = require('fs'),
    express = require('express'),
    moment = require('moment'),
    checklogin = require('../../../modules/checklogin.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.email) {
        req.getConnection(function(err, connection) {
            var sql = 'SELECT id, slideshow_id, name FROM displays';
            // Get the user id using username
            connection.query(sql, function(err, match) {
                if (err) {
                    throw err;
                }
                if (match !== '' && match.length > 0) {
                    res.render('admin/displays/show', {
                        title: 'Displays',
                        logedin: checklogin(req.session),
                        data: match
                    });
                } else {
                    res.render('admin/displays/show', {
                        title: 'Displays',
                        logedin: checklogin(req.session),
                        error: 'You have no displays jet',
                        data: match
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
        getDisplayNames(req, res, false, login)
    } else {
        res.redirect('/users/login');
    }
});

router.post('/add', function(req, res) {
    var login = checklogin(req.session);
    var email = req.session.email,
        body = req.body,
        name = body.name,
        slideshow_id = body.slideshow_id,
        now = new Date();

    if (name !== undefined && name.length !== 0 && slideshow_id !== null) {
        req.getConnection(function(err, connection) {
            console.log('jhio');
            var sqlQuery = 'INSERT INTO displays SET ?',
                sqlValues = {
                    name: name,
                    slideshow_id: slideshow_id,
                    date_created: now
                };

            // Insert the new photo data
            connection.query(sqlQuery, sqlValues, function(err, user) {
                if (err) {
                    throw err;
                }
                res.redirect('/admin/displays');
            });
        });

    } else {
        getDisplayNames(req, res, 'You have not filled in a name', login)
    }
});

function getDisplayNames(req, res, error, login) {
    req.getConnection(function(err, connection) {
        var sql = 'SELECT id, name FROM slideshows';
        // Get the user id using username
        connection.query(sql, function(err, match) {
            if (err) {
                throw err;
            }
            res.render('admin/displays/add', {
                title: 'Add a display',
                postUrl: '/admin/displays/add',
                error: error,
                data: match,
                logedin: login
            });
        });
    });
};


module.exports = router;
