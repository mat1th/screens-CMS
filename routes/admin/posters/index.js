var express = require('express'),
    moment = require('moment'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    insertData = require('../../../modules/insertData.js'),
    credentials = require('../../../modules/credentials.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    router = express.Router();


router.get('/', function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Your posters',
            login: cr.login,
            admin: cr.admin,
            email: cr.email
                // navStyle: 'icons-only'
        },
        postUrls = {
            settings: '/admin/slideshows/edit',
            posters: '/admin/posters/edit',
            displays: '/admin/posters/edit'
        },
        sql;

    if (general.login) {
        req.getConnection(function(err, connection) {
            if (general.admin) {
                sql = 'SELECT filename, type, name, id FROM posters';
            } else {
                sql = 'SELECT filename, type, name, id FROM posters WHERE userId IN( SELECT id FROM users WHERE email = ? )';
            }
            // sql = 'CASE'
            getSpecificData(sql, connection, [general.email]).then(function(rows) {
                var data = {
                    general: rows
                };
                //renderTemplate
                renderTemplate(res, 'admin/posters/show', data, general, postUrls, false);
                //
            }).catch(function(err) {
                throw err;
            });
        });
    } else {
        res.redirect('/users/login');
    }
});

router.get('/add', function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Add a poster',
            login: cr.login,
            admin: cr.admin,
            email: cr.email
        },
        postUrls = {
            general: '/admin/posters/add'
        };

    if (general.login) {
        renderTemplate(res, 'admin/posters/add', {}, general, postUrls, false);
    } else {
        res.redirect('/users/login');
    }
});


// GET a poster and present the full poster page
router.get('/show/:posterId', function(req, res) {
    var posterId = req.params.posterId,
        cr = credentials(req.session),
        general = {
            title: 'Add a poster',
            login: cr.login,
            admin: cr.admin,
            email: cr.email
        },
        sql;

    if (general.login) {
        req.getConnection(function(err, connection, next) {
            if (err) return next(err);
            if (general.admin) {
                sql = 'SELECT id, name, discription, duration, animation, filename, type, dateStart, dateEnd, dataCreated FROM posters WHERE id = ?';
            } else {
                sql = 'SELECT id, name,discription, duration, animation, filename, type, dateStart, dateEnd, dataCreated FROM posters WHERE id = ? AND userId IN( SELECT id FROM users WHERE email = ? )';
            }
            getSpecificData(sql, connection, [posterId, general.email]).then(function(rows) {
                var data = {
                    general: {
                        id: rows[0].id,
                        discription: rows[0].discription,
                        duration: rows[0].duration,
                        name: rows[0].name,
                        animation: rows[0].animation,
                        filename: rows[0].filename,
                        type: rows[0].type,
                        dateStart: moment(rows[0].dateStart).format('LL'),
                        dateEnd: moment(rows[0].dateEnd).format('LL'),
                        dataCreated: moment(rows[0].dataCreated).startOf('day').fromNow()
                    }
                };
                //renderTemplate
                renderTemplate(res, 'admin/posters/detail', data, general, {}, false);
                //
            }).catch(function(err) {
                console.log(err);
                throw err;
            });
        });
    }

});

router.post('/add', function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Add a poster',
            login: cr.login,
            admin: cr.admin,
            email: cr.email
        },
        body = req.body,
        name = body.name,
        discription = body.discription,
        vimeoId = body.vimeoId,
        duration = body.duration,
        type = body.type,
        dateStart = body.dateStart,
        dateEnd = body.dateEnd,
        now = new Date(),
        upload = req.files;

    if (general.login) {
        //check if data is valid
        if (isValidDate(dateStart) && isValidDate(dateEnd)) {
            req.getConnection(function(err, connection) {
                var sql = 'SELECT id FROM users WHERE email = ?';
                // Get the user id using username
                getSpecificData(sql, connection, [general.email]).then(function(rows) {
                    if (rows.length > 0 && upload.imageFile && type !== null) {
                        var sqlQuery = 'INSERT INTO posters SET ?',
                            sqlValues = {
                                userId: rows[0].id,
                                name: name,
                                discription: discription,
                                filename: upload.imageFile.name,
                                vimeoId: vimeoId,
                                duration: duration,
                                type: type,
                                dateStart: dateStart,
                                dateEnd: dateEnd,
                                dataCreated: now
                            };

                        insertData(sqlQuery, sqlValues, connection).then(function() {
                            res.redirect('/admin/posters');
                        }).catch(function(err) {
                            throw err;
                        });

                    } else {
                        renderTemplate(res, 'admin/posters/add', {}, general, {}, 'There is something wrong with your image');
                    }
                    //renderTemplate
                    renderTemplate(res, 'admin/posters/detail', {}, general, {}, false);
                    //
                }).catch(function(err) {
                    throw err;
                });
            });
        } else {
            renderTemplate(res, 'admin/posters/add', {}, general, {}, 'You have submit a wrong date');
        }
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;
