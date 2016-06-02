var express = require('express'),
    credentials = require('../../../modules/credentials.js'),
    randNumber = require('../../../modules/randNumber.js'),
    router = express.Router();


router.get('/', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        renderPage = function(data, error) {
            res.render('admin/displays/show', {
                title: 'Displays',
                rights: {
                    admin: admin,
                    logedin: login
                },
                error: error,
                data: data
            });
        };

    if (admin) {
        req.getConnection(function(err, connection) {
            var sql = 'SELECT display_id, slideshowId, name FROM displays';
            // Get the user id using username
            connection.query(sql, function(err, match) {
                if (err) throw err;

                if (match !== '' && match.length > 0) {
                    renderPage(match);

                } else {
                    renderPage(match, 'You have no displays jet');
                }
            });
        });
    } else {
        res.redirect('/admin');
    }
});

router.get('/add', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin;

    if (admin) {
        getDisplayNames(req, res, false, login, admin);
    } else {
        res.redirect('/admin');
    }
});

router.post('/add', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        body = req.body,
        name = body.name,
        slideshowId = body.slideshowId,
        now = new Date();

    if (admin) {
        if (name !== undefined && name.length !== 0 && slideshowId !== null) {
            req.getConnection(function(err, connection) {
                var sqlQuery = 'INSERT INTO displays SET ?',
                    sqlValues = {
                        display_id: randNumber(1000),
                        name: name,
                        slideshowId: slideshowId,
                        dataCreated: now
                    };

                // Insert the new photo data
                connection.query(sqlQuery, sqlValues, function(err) {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/admin/displays');
                });
            });
        } else {
            getDisplayNames(req, res, 'You haven\'t filled in a name', login);
        }
    } else {
        res.redirect('/admin');
    }
});

function getDisplayNames(req, res, error, login, admin) {
    req.getConnection(function(err, connection) {
        var sql = 'SELECT id, slideshow_name FROM slideshows';
        // Get the user id using username
        connection.query(sql, function(err, match) {
            if (err) {
                throw err;
            }
            res.render('admin/displays/add', {
                title: 'Add a display',
                rights: {
                    admin: admin,
                    logedin: login
                },
                postUrl: '/admin/displays/add',
                error: error,
                data: match
            });
        });
    });
}


module.exports = router;
