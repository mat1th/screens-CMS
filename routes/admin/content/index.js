var express = require('express'),
    checkLogin = require('../../middleware/checklogin.js'),
    setRights = require('../../middleware/setRights.js'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    insertData = require('../../../modules/insertData.js'),
    credentials = require('../../../modules/credentials.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    sendMessage = require('../../../modules/sendMessage.js'),
    router = express.Router();

router.get('/', checkLogin, setRights, function(req, res) {
    var cr = credentials(req.session),
        expired = req.query.expired,
        general = {
            title: 'Your content',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor
        },
        postUrls = {
            settings: '/admin/slideshows/edit',
            content: '/admin/content/edit',
            displays: '/admin/content/edit'
        },
        data = {
            general: null,
            url: null
        },
        sql;

    req.getConnection(function(err, connection) {
        if (!expired) {
            data.url = '/admin/content?expired=true';
            if (req.admin) {
                sql = 'SELECT * FROM content WHERE dateEnd > CURDATE()';
            } else {
                sql = 'SELECT * FROM content WHERE userId IN( SELECT id FROM users WHERE email = ? ) AND dateEnd > CURDATE()';
            }
        } else {
            data.url = '/admin/content';
            if (req.admin) {
                sql = 'SELECT * FROM content WHERE dateEnd < CURDATE()';
            } else {
                sql = 'SELECT * FROM content WHERE userId IN( SELECT id FROM users WHERE email = ? ) AND dateEnd < CURDATE()';
            }
        }


        getSpecificData(sql, connection, [req.email]).then(function(rows) {
            data.general = rows;

            //renderTemplate
            renderTemplate(res, 'admin/content/show', data, general, postUrls, false);
            //
        }).catch(function(err) {
            throw err;
        });
    });
});

router.get('/add', function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Add content',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email
        },
        postUrls = {
            general: '/admin/content/add'
        };

    if (general.login) {
        renderTemplate(res, 'admin/content/add', {}, general, postUrls, false);
    } else {
        res.redirect('/users/login');
    }
});


// GET a content and present the full content page
router.get('/show/:contentId', function(req, res) {
    var contentId = req.params.contentId,
        cr = credentials(req.session),
        general = {
            title: 'Add content',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email
        },
        postUrls = {
            general: '/admin/content/decision'
        },
        sql;

    if (general.login) {
        req.getConnection(function(err, connection, next) {
            if (err) return next(err);
            if (general.admin) {
                sql = 'SELECT id, name, discription, duration, animation, filename, type, dateStart, dateEnd, checked, dataCreated, vimeoId FROM content WHERE id = ?';
            } else {
                sql = 'SELECT id, name,discription, duration, animation, filename, type, dateStart, dateEnd, checked, dataCreated, vimeoId FROM content WHERE id = ? AND userId IN( SELECT id FROM users WHERE email = ? )';
            }
            getSpecificData(sql, connection, [contentId, general.email]).then(function(rows) {
                var data = {
                    general: rows[0]
                };
                //renderTemplate
                renderTemplate(res, 'admin/content/detail', data, general, postUrls, false);
                //
            }).catch(function(err) {
                console.log(err);
                throw err;
            });
        });
    }
});

router.post('/decision', checkLogin, setRights, function(req, res) {
    var sqlQuery,
        body = req.body,
        decision = JSON.parse(body.decision),
        posterId = body.posterId;

    if (typeof(decision) === 'boolean') {
        req.getConnection(function(err, connection) {
            if (decision === true) {
                sqlQuery = 'UPDATE content SET `checked` = 1 WHERE id = ?';
            } else {
                sqlQuery = 'delete FROM content where id = ?';
                //need to implement to delete the poster if it's not a vimeo video

                var emailQuery = 'SELECT * FROM content T1 LEFT JOIN users T2 ON T1.userId = T2.id WHERE T1.id = ?';
                getSpecificData(emailQuery, connection, [posterId]).then(function(rows) {
                    var data = rows[0];
                    var message = {
                        text: '',
                        from: 'Digitale Posters mail <matthias.d@outlook.com>',
                        to: 'someone <' + data.email + '>',
                        subject: 'Your content isn\'t accepted.',
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
                res.redirect('/admin/content/');
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
            title: 'Add content',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email
        },
        body = req.body,
        data = {
            general: {
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
                vimeoImage: '' || body.vimeoImage,
                upload: req.files,
                fileName: ''
            }
        };

    //check if data is valid
    if (isValidDate(data.general.dateStart) && isValidDate(data.general.dateEnd)) {
        if (data.general.type !== null) {
            req.getConnection(function(err, connection) {
                if (general.admin || general.editor) {
                    sqlQuery = 'INSERT INTO content SET `userId` =  (SELECT id FROM users WHERE email = ?), `name` = ?, `discription` = ?, `animation` = ?, `color` = ?, `filename` = ?, `duration` = ?, `type` = ?, `dateStart` = ?, `dateEnd` = ?, `dataCreated` = ?, `checked` = 1,  `vimeoId` = ?, `vimeoImage` = ?;';
                } else {
                    sqlQuery = 'INSERT INTO content SET `userId` =  (SELECT id FROM users WHERE email = ?), `name` = ?, `discription` = ?, `animation` = ?, `color` = ?, `filename` = ?, `duration` = ?, `type` = ?, `dateStart` = ?, `dateEnd` = ?, `dataCreated` = ?, `vimeoId` = ?, `vimeoImage` = ?;';
                }
                if (data.general.upload.imageFile) {
                    data.general.fileName = data.general.upload.imageFile.name;
                }

                insertData(sqlQuery, [general.email, data.general.name, data.generaldiscription, data.general.animation, data.general.color, data.general.fileName, data.general.duration, data.general.type, data.general.dateStart, data.general.dateEnd, data.general.dataCreated, data.general.vimeoId, data.general.vimeoImage], connection).then(function() {
                    //send a mail if the use is not a admin
                    if (!general.admin) {
                        var message = {
                            text: '',
                            from: 'Digitale Posters mail <matthias.d@outlook.com>',
                            to: 'someone <matthias@dolstra.me',
                            subject: 'A new content needs to be checked',
                            attachment: [{
                                data: '<html> Hello ' + 'Matthias' + ', </br> </br>' + general.email + ' has uploaded a poster or vimeo movie. </br> </br> Please check the <a href="http://posters.dolstra.me/login">Website</a> for the content.  </br>  </br> <img src="http://posters.dolstra.me/download' + data.upload.imageFile.name + '" alt="uploaded poster" />  </br>  </br> The Digital poster team' + '</html>',
                                alternative: true
                            }]
                        };

                        sendMessage(message);
                    }
                    res.redirect('/admin/content');
                }).catch(function(err) {
                    console.log(err);
                    throw err;
                });
            });
        } else {
            renderTemplate(res, 'admin/content/add', data, general, {}, 'You have got no image uploaded');
        }
    } else {
        renderTemplate(res, 'admin/content/add', data, general, {}, 'You have submit a wrong date');
    }

});


router.post('/edit/:contentId', checkLogin, function(req, res) {
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
            contentId: req.params.contentId
        };

    var sqlQuery = 'UPDATE content SET animation = ?, duration = ?, dateStart = ?, dateEnd = ? WHERE id = ?';


    if (isValidDate(data.dateStart) && isValidDate(data.dateEnd)) {
        req.getConnection(function(err, connection) {
            insertData(sqlQuery, [data.animation, data.duration, data.dateStart, data.dateEnd, data.contentId], connection).then(function() {
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
