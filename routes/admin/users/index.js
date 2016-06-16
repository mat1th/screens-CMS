var express = require('express'),
    checkLogin = require('../../middleware/checklogin.js'),
    checkRightsAdmin = require('../../middleware/checkRightsAdmin.js'),
    credentials = require('../../../modules/credentials.js'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    insertData = require('../../../modules/insertData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', checkLogin, checkRightsAdmin, function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Displays',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor
        },
        sql;

    if (general.admin) {
        req.getConnection(function(err, connection) {
            sql = 'SELECT email, name, role, id FROM users';
            // Get the user id using username
            connection.query(sql, function(err, match) {
                if (err) {
                    throw err;
                }
                if (match !== '' && match.length > 0) {
                    renderTemplate(res, 'admin/users/show', {
                        general: match
                    }, general, {}, false);
                } else {
                    renderTemplate(res, 'admin/users/show', {
                        general: match
                    }, general, {}, 'There are no users');
                }
            });
        });
    } else {
        res.redirect('/admin');
    }

});

router.get('/edit/:userId', checkLogin, checkRightsAdmin, function(req, res, next) {
    var userId = req.params.userId,
        cr = credentials(req.session),
        general = {
            title: 'Your content',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor
        },
        postUrls = {
            general: '/admin/users/edit'
        };

    req.getConnection(function(err, connection) {
        var sql = 'SELECT email, name, role, id FROM users WHERE id = ?';

        getSpecificData(sql, connection, [userId]).then(function(rows) {
            var data = {
                general: rows[0]
            };

            //renderTemplate
            renderTemplate(res, 'admin/users/edit', data, general, postUrls, false);
            //
        }).catch(function(err) {
            throw err;
        });
    });
});


router.post('/edit', checkLogin, function(req, res) {
    var sqlQuery = 'UPDATE users SET `role` = ?, `name` = ?, `email` = ? WHERE id = ?',
        body = req.body,
        data = {
            role: body.role,
            name: body.name,
            email: body.email,
            id: body.id
        };

    req.getConnection(function(err, connection) {
        insertData(sqlQuery, [data.role, data.name, data.email, data.id], connection).then(function() {
            res.redirect('/admin/users/edit/' + data.id);
        }).catch(function(err) {
            console.log(err);
            throw err;
        });
    });
    console.log(data);
});



module.exports = router;
