var express = require('express'),
    checkRightsAdmin = require('../../middleware/checkRightsAdmin.js'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    insertData = require('../../../modules/insertData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', checkRightsAdmin, function(req, res) {
    var general = {
            title: 'Displays' //the title of the page
        },
        sql;

    req.getConnection(function(err, connection) {
        sql = 'SELECT email, name, role, id FROM users'; //get all the users
        // Get the user id using username
        connection.query(sql, function(err, match) {
            if (err) {
                throw err;
            }
            if (match !== '' && match.length > 0) {
                renderTemplate(res, req, 'admin/users/show', { //render the tempate with the data from the users
                    general: match
                }, general, {}, false);
            } //no else because there will never be no users
        });
    });
});

router.get('/edit/:userId', checkRightsAdmin, function(req, res) { // edit the user with the user id
    var userId = req.params.userId,
        general = {
            title: 'Your content'
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
            renderTemplate(res, req, 'admin/users/edit', data, general, postUrls, false);
            //
        }).catch(function(err) {
            throw err;
        });
    });
});

router.post('/edit', checkRightsAdmin, function(req, res) { //post to eddit and only the user with admin rights will be
    var sqlQuery = 'UPDATE users SET `role` = ?, `name` = ?, `email` = ? WHERE id = ?',
        body = req.body,
        data = {
            role: body.role,
            name: body.name,
            email: body.email,
            id: body.id
        },
        general = {
            title: 'Your content'
        },
        postUrls = {
            general: '/admin/users/edit'
        };
    if (data.role === 'admin' || data.role === 'editor' || data.role === 'publisher') { //check if there is set a right that exists
        req.getConnection(function(err, connection) { //get the connection with the mysql databasae
            insertData(sqlQuery, [data.role, data.name, data.email, data.id], connection).then(function() {
                res.redirect('/admin/users/');
            }).catch(function(err) {
                console.log(err);
                throw err;
            });
        });
    } else {
        renderTemplate(res, req, 'admin/users/edit', data, general, postUrls, false);
    }
});

module.exports = router;
