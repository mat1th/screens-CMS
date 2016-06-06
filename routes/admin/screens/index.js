var express = require('express'),
    checkLogin = require('../../middleware/checklogin.js'),
    checkRights = require('../../middleware/checkRights.js'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    insertData = require('../../../modules/insertData.js'),
    credentials = require('../../../modules/credentials.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    sendMessage = require('../../../modules/sendMessage.js'),
    router = express.Router();

router.get('/', checkLogin, checkRights, function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Your screens',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor
        },
        postUrls = {
            settings: '/admin/slideshows/edit',
            screens: '/admin/screens/edit',
            displays: '/admin/screens/edit'
        },
        sql;

    req.getConnection(function(err, connection) {
        if (req.admin) {
            sql = 'SELECT filename, type, name, checked, id FROM screens';
        } else {
            sql = 'SELECT filename, type, name, checked, id FROM screens WHERE userId IN( SELECT id FROM users WHERE email = ? )';
        }
        // sql = 'CASE'
        getSpecificData(sql, connection, [req.email]).then(function(rows) {
            var data = {
                general: rows
            };
            //renderTemplate
            renderTemplate(res, 'admin/screens/show', data, general, postUrls, false);
            //
        }).catch(function(err) {
            throw err;
        });
    });
});

router.get('/add', function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Add a screen',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email
        },
        postUrls = {
            general: '/admin/screens/add'
        };

    if (general.login) {
        renderTemplate(res, 'admin/screens/add', {}, general, postUrls, false);
    } else {
        res.redirect('/users/login');
    }
});


// GET a screen and present the full screen page
router.get('/show/:screenId', function(req, res) {
    var screenId = req.params.screenId,
        cr = credentials(req.session),
        general = {
            title: 'Add a screen',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email
        },
        postUrls = {
            general: '/admin/screens/decision'
        },
        sql;


    if (general.login) {
        req.getConnection(function(err, connection, next) {
            if (err) return next(err);
            if (general.admin) {
                sql = 'SELECT id, name, discription, duration, animation, filename, type, dateStart, dateEnd, checked, dataCreated, vimeoId FROM screens WHERE id = ?';
            } else {
                sql = 'SELECT id, name,discription, duration, animation, filename, type, dateStart, dateEnd, checked, dataCreated, vimeoId FROM screens WHERE id = ? AND userId IN( SELECT id FROM users WHERE email = ? )';
            }
            getSpecificData(sql, connection, [screenId, general.email]).then(function(rows) {
                var data = {
                    general: rows[0]
                };
                //renderTemplate
                renderTemplate(res, 'admin/screens/detail', data, general, postUrls, false);
                //
            }).catch(function(err) {
                console.log(err);
                throw err;
            });
        });
    }
});

router.post('/decision', checkLogin, checkRights, function(req, res) {
    var sqlQuery,
        body = req.body,
        decision = JSON.parse(body.decision),
        posterId = body.posterId;

    if (typeof(decision) === 'boolean') {
        req.getConnection(function(err, connection) {
            if (decision === true) {
                sqlQuery = 'UPDATE screens SET `checked` = 1 WHERE id = ?';
            } else {
                sqlQuery = 'delete FROM screens where id = ?';
                //need to implement to delete the poster if it's not a vimeo video

                var emailQuery = 'SELECT * FROM screens T1 LEFT JOIN users T2 ON T1.userId = T2.id WHERE T1.id = ?';
                getSpecificData(emailQuery, connection, [posterId]).then(function(rows) {
                  var data = rows[0];
                    var message = {
                        text: '',
                        from: 'Digitale Posters mail <matthias.d@outlook.com>',
                        to: 'someone <' + data.email + '>',
                        subject: 'Your screen isn\'t accepted.',
                        attachment: [{
                            data: '<html> Hello ' + data.name + ', </br> </br>' + 'Your poster has been deleted trught the admin. Ask ' + req.email + ' why. </br>  </br> The Digital poster team' + '</html>',
                            alternative: true
                        }]
                    };
                    console.log(message);
                    return message;

                }).then(function(message) {
                    //send the message to the user who's poster is deleted
                    sendMessage(message);

                }).catch(function(err) {
                    console.log(err);
                    throw err;
                });
            }

            insertData(sqlQuery, [posterId], connection).then(function() {
                res.redirect('/admin/screens/');
            }).catch(function(err) {
                console.log(err);
                throw err;
            });

        });
    } else {
        res.send('error');
    }

});

router.post('/add', checkLogin, function(req, res) {
    var cr = credentials(req.session),
        sqlQuery,
        general = {
            title: 'Add a screen',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email
        },
        body = req.body,
        data = {
            name: body.name,
            animation: body.animation,
            color: body.color,
            discription: body.discription,
            vimeoId: body.vimeoId,
            duration: body.duration,
            type: body.type,
            dateStart: body.dateStart,
            dateEnd: body.dateEnd,
            dataCreated: new Date(),
            upload: req.files
        };

    //check if data is valid
    if (isValidDate(data.dateStart) && isValidDate(data.dateEnd)) {
        if (data.upload.imageFile && data.type !== null) {
            req.getConnection(function(err, connection) {
                if (general.admin || general.editor) {
                    sqlQuery = 'INSERT INTO screens SET `userId` =  (SELECT id FROM users WHERE email = ?), `name` = ?, `discription` = ?, `animation` = ?, `color` = ?, `filename` = ?, `duration` = ?, `type` = ?, `dateStart` = ?, `dateEnd` = ?, `dataCreated` = ?, `checked` = 1, `vimeoId` = ?';
                } else {
                    sqlQuery = 'INSERT INTO screens SET `userId` =  (SELECT id FROM users WHERE email = ?), `name` = ?, `discription` = ?, `animation` = ?, `color` = ?, `filename` = ?, `duration` = ?, `type` = ?, `dateStart` = ?, `dateEnd` = ?, `dataCreated` = ?, `vimeoId` = ?';
                }

                insertData(sqlQuery, [general.email, data.name, data.discription, data.animation, data.color, data.upload.imageFile.name, data.duration, data.type, data.dateStart, data.dateEnd, data.dataCreated, data.vimeoId], connection).then(function() {
                    //send a mail if the use is not a admin
                    if (!general.admin) {
                        var message = {
                            text: '',
                            from: 'Digitale Posters mail <matthias.d@outlook.com>',
                            to: 'someone <matthias@dolstra.me',
                            subject: 'A new screen needs to be checked',
                            attachment: [{
                                data: '<html> Hello ' + 'Matthias' + ', </br> </br>' + general.email + ' has uploaded a poster or vimeo movie. </br> </br> Please check the <a href="http://posters.dolstra.me/login">Website</a> for the screen.  </br>  </br> <img src="http://posters.dolstra.me/download' + data.upload.imageFile.name + '" alt="uploaded poster" />  </br>  </br> The Digital poster team' + '</html>',
                                alternative: true
                            }]
                        };

                        sendMessage(message);
                    }
                    res.redirect('/admin/screens');
                }).catch(function(err) {
                    console.log(err);
                    throw err;
                });
            });
        } else {
            renderTemplate(res, 'admin/screens/add', {}, general, {}, 'You have got no image uploaded');
        }
    } else {
        renderTemplate(res, 'admin/screens/add', {}, general, {}, 'You have submit a wrong date');
    }

});


router.post('/edit/:screenId', checkLogin, function(req, res) {
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
            screenId: req.params.screenId
        };

    var sqlQuery = 'UPDATE screens SET animation = ?, duration = ?, dateStart = ?, dateEnd = ? WHERE id = ?';


    if (isValidDate(data.dateStart) && isValidDate(data.dateEnd)) {
        req.getConnection(function(err, connection) {
            insertData(sqlQuery, [data.animation, data.duration, data.dateStart, data.dateEnd, data.screenId], connection).then(function() {
                res.redirect('admin/slideshows/');
            }).catch(function(err) {
                res.send('error:' + err);
                console.log(err);
                throw err;
            });
        });

    }
});

module.exports = router;
