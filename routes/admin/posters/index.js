var express = require('express'),
    moment = require('moment'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    insertData = require('../../../modules/insertData.js'),
    credentials = require('../../../modules/credentials.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    sendMessage = require('../../../modules/sendMessage.js'),
    router = express.Router();

router.get('/', function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Your posters',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
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
                sql = 'SELECT filename, type, name, checked, id FROM posters';
            } else {
                sql = 'SELECT filename, type, name, checked, id FROM posters WHERE userId IN( SELECT id FROM users WHERE email = ? )';
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
            editor: cr.editor,
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
            editor: cr.editor,
            email: cr.email
        },
        sql;


    if (general.login) {
        req.getConnection(function(err, connection, next) {
            if (err) return next(err);
            if (general.admin) {
                sql = 'SELECT id, name, discription, duration, animation, filename, type, dateStart, dateEnd, checked, dataCreated FROM posters WHERE id = ?';
            } else {
                sql = 'SELECT id, name,discription, duration, animation, filename, type, dateStart, dateEnd, checked, dataCreated FROM posters WHERE id = ? AND userId IN( SELECT id FROM users WHERE email = ? )';
            }
            getSpecificData(sql, connection, [posterId, general.email]).then(function(rows) {
                console.log(rows[0].checked);
                var data = {
                    general: {
                        id: rows[0].id,
                        discription: rows[0].discription,
                        duration: rows[0].duration,
                        name: rows[0].name,
                        animation: rows[0].animation,
                        filename: rows[0].filename,
                        type: rows[0].type,
                        checked: rows[0].checked,
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
        sqlQuery,
        general = {
            title: 'Add a poster',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email
        },
        body = req.body,
        data = {
            name: body.name,
            animation: body.animation,
            discription: body.discription,
            vimeoId: body.vimeoId,
            duration: body.duration,
            type: body.type,
            dateStart: body.dateStart,
            dateEnd: body.dateEnd,
            dataCreated: new Date(),
            upload: req.files
        };

    if (general.login) {
        //check if data is valid
        if (isValidDate(data.dateStart) && isValidDate(data.dateEnd)) {
            if (data.upload.imageFile && data.type !== null) {
                req.getConnection(function(err, connection) {
                    if (general.admin || general.editor) {
                        sqlQuery = 'INSERT INTO posters SET `userId` =  (SELECT id FROM users WHERE email = ?), `name` = ?, `discription` = ?, `animation` = ?, `filename` = ?, `duration` = ?, `type` = ?, `dateStart` = ?, `dateEnd` = ?, `dataCreated` = ?, `checked` = 1, `vimeoId` = ?';
                    } else {
                        sqlQuery = 'INSERT INTO posters SET `userId` =  (SELECT id FROM users WHERE email = ?), `name` = ?, `discription` = ?, `animation` = ?, `filename` = ?, `duration` = ?, `type` = ?, `dateStart` = ?, `dateEnd` = ?, `dataCreated` = ?, `vimeoId` = ?';
                    }

                    insertData(sqlQuery, [general.email, data.name, data.discription, data.animation, data.upload.imageFile.name, data.duration, data.type, data.dateStart, data.dateEnd, data.dataCreated, data.vimeoId], connection).then(function() {
                          //send a mail if the use is not a admin
                        if(!general.admin) {
                          sendMessage('Matthias', general.email, data.upload.imageFile.name);
                        }

                        res.redirect('/admin/posters');
                    }).catch(function(err) {
                        console.log(err);
                        throw err;
                    });
                });
            } else {
                renderTemplate(res, 'admin/posters/add', {}, general, {}, 'You have got no image uploaded');
            }
        } else {
            renderTemplate(res, 'admin/posters/add', {}, general, {}, 'You have submit a wrong date');
        }
    } else {
        res.redirect('/users/login');
    }
});

router.post('/edit/:posterId', function(req, res) {
    var cr = credentials(req.session),
        general = {
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email
        },
        body = req.body,
        data = {
            animation: body.animation,
            duration: body.duration,
            dateStart: body.dateStart,
            dateEnd: body.dateEnd,
            posterId: req.params.posterId
        };

    var sqlQuery = 'UPDATE posters SET animation = ?, duration = ?, dateStart = ?, dateEnd = ? WHERE id = ?';

    if (general.login) {
        if (isValidDate(data.dateStart) && isValidDate(data.dateEnd)) {
            req.getConnection(function(err, connection) {
                insertData(sqlQuery, [data.animation, data.duration, data.dateStart, data.dateEnd, data.posterId], connection).then(function() {
                    res.redirect('admin/slideshows/');
                }).catch(function(err) {
                    res.send('error:' + err);
                    console.log(err);
                    throw err;
                });
            });
        } else {
            res.send('your dates are wrong!');
        }
    }
});

module.exports = router;
