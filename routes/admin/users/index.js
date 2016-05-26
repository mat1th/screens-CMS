var fs = require('fs'),
    express = require('express'),
    moment = require('moment'),
    checklogin = require('../../../modules/checklogin.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.email) {
        req.getConnection(function(err, connection) {
            var sql = 'SELECT email, name, role FROM users';
            // Get the user id using username
            connection.query(sql, function(err, match) {
                if (err) {
                    throw err;
                }
                if (match !== '' && match.length > 0) {
                    res.render('admin/users/show', {
                        title: 'Users',
                        logedin: checklogin(req.session),
                        data: match
                    });
                } else {
                    res.render('admin/users/show', {
                        title: 'Users',
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
        res.render('admin/users/add', {
            title: 'Add a poster',
            postUrl: '/admin/slideshows/add',
            error: false,
            logedin: login
        });
    } else {
        res.redirect('/users/login');
    }

});



module.exports = router;
