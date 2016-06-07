var express = require('express'),
    checkLogin = require('../../middleware/checklogin.js'),
    checkRightsAdmin = require('../../middleware/checkRightsAdmin.js'),
    credentials = require('../../../modules/credentials.js'),
    randNumber = require('../../../modules/randNumber.js'),
    router = express.Router();


router.get('/', checkLogin, function(req, res) {
    res.redirect('/admin/slideshows');
});

router.get('/add', checkLogin, checkRightsAdmin, function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        editor = cr.editor,
        admin = cr.admin;

    getDisplayNames(req, res, false, login, admin, editor);
});

router.post('/add', checkLogin, checkRightsAdmin, function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        editor = cr.editor,
        body = req.body,
        name = body.name,
        slideshowId = body.slideshowId,
        now = new Date();

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
        getDisplayNames(req, res, 'You haven\'t filled in a name', login, admin, editor);
    }

});

function getDisplayNames(req, res, error, login, admin, editor) {
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
                    logedin: login,
                    editor: editor
                },
                postUrl: '/admin/displays/add',
                error: error,
                data: match
            });
        });
    });
}


module.exports = router;
