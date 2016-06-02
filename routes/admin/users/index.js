var express = require('express'),
    credentials = require('../../../modules/credentials.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', function(req, res, next) {
    var cr = credentials(req.session),
        general = {
            title: 'Displays',
            login: cr.login,
            admin: cr.admin,
            email: cr.email
                // navStyle: 'icons-only'
        },
        sql;

    if (general.admin) {
        req.getConnection(function(err, connection) {
            sql = 'SELECT email, name, role FROM users';
            // Get the user id using username
            connection.query(sql, function(err, match) {
                if (err) {
                    throw err;
                }
                if (match !== '' && match.length > 0) {
                    renderTemplate(res, 'admin/users/show', {general: match}, general, {}, false);
                } else {
                    renderTemplate(res, 'admin/users/show', {general: match}, general, {}, 'There are no users');
                }
            });
        });
    } else {
        res.redirect('/admin');
    }

});

// router.get('/add', function(req, res, next) {
//     var cr = credentials(req.session),
//         login = cr.login,
//         admin = cr.admin;
//
//     if (admin) {
//         res.render('admin/users/add', {
//             title: 'Add a poster',
//             rights: {
//                 admin: admin,
//                 logedin: login
//             },
//             postUrl: '/admin/slideshows/add',
//             error: false
//         });
//     } else {
//         res.redirect('/admin');
//     }
//
// });



module.exports = router;
