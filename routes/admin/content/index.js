var express = require('express'),
    moment = require('moment'),
    randNumber = require('../../../modules/randNumber.js'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    insertData = require('../../../modules/insertData.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    confertDate = require('../../../modules/confertDate.js'),
    sendMessage = require('../../../modules/sendMessage.js'),
    sendRefresh = require('../../../modules/sendRefresh.js'),
    checkRightsEditor = require('../../middleware/checkRightsEditor.js'),
    router = express.Router(); //create router

router.get('/', function(req, res) { // the admin/content page
    var expired = req.query.expired,
        general = {
            title: 'Your content'
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
        if (!expired) { //check if the the ?expired=true queu is in the url
            data.url = '/admin/content?expired=true'; //set the link of the button to this
            if (req.admin) { //if its a admin show all the content
                sql = 'SELECT * FROM content WHERE dateEnd > CURDATE()';
            } else {
                sql = 'SELECT * FROM content WHERE userId = ?  AND dateEnd > CURDATE()';
            }
        } else { //show only expired content
            data.url = '/admin/content';
            if (req.admin) { //if its a admin show all the content
                sql = 'SELECT * FROM content WHERE dateEnd < CURDATE()';
            } else {
                sql = 'SELECT * FROM content WHERE userId = ?  AND dateEnd < CURDATE()';
            }
        }

        getSpecificData(sql, connection, [req.session.user_id]).then(function(rows) {
            data.general = rows;
            //renderTemplate
            renderTemplate(res, req, 'admin/content/show', data, general, postUrls, false); //render the tepmlate

        }).catch(function(err) {
            throw err;
        });
    });
});

router.get('/add', function(req, res) { // the admin/content/add page
    var general = {
            title: 'Add content'
        },
        postUrls = {
            general: '/admin/content/add' //the url the form should post to
        };
    renderTemplate(res, req, 'admin/content/add', {}, general, postUrls, false);
});


// GET a content and present the full content page
router.get('/show/:contentId', function(req, res) { //the admin/show/id page
    var contentId = req.params.contentId,
        general = {
            title: 'Add content'
        },
        postUrls = {
            general: '/admin/content/decision' //the url the form should post to
        },
        sql;

    req.getConnection(function(err, connection, next) {
        if (err) return next(err);
        if (req.admin) { // if its a admin show all the content if not only the poster form the user himself
            sql = 'SELECT id, name, discription, duration, animation, filename, type, dateStart, dateEnd, checked, dataCreated, vimeoId FROM content WHERE id = ?';
        } else {
            sql = 'SELECT id, name,discription, duration, animation, filename, type, dateStart, dateEnd, checked, dataCreated, vimeoId FROM content WHERE id = ? AND userId = ? ';
        }
        getSpecificData(sql, connection, [contentId, req.session.user_id]).then(function(rows) {
            var data = {
                general: rows[0]
            };
            if (rows[0] === undefined) {
                res.redirect('/admin/content');
            } else {
                //renderTemplate
                renderTemplate(res, req, 'admin/content/detail', data, general, postUrls, false);
            }
        }).catch(function(err) {
            renderTemplate(res, req, 'admin/content/detail', {}, general, postUrls, err);
            throw err;
        });
    });
});

router.post('/decision', function(req, res) { // the admin/content/decision post
    var sqlQuery,
        body = req.body,
        decision = JSON.parse(body.decision),
        posterId = body.posterId;

    if (typeof(decision) === 'boolean') { //the dission to accept op decline the poster.
        req.getConnection(function(err, connection) {
            if (decision === true) {
                sqlQuery = 'UPDATE content SET `checked` = 1 WHERE id = ?';
            } else {
                sqlQuery = 'delete FROM content where id = ?';
                //need to implement to delete the poster if it's not a vimeo video

                var emailQuery = 'SELECT * FROM content T1 LEFT JOIN users T2 ON T1.userId = T2.id WHERE T1.id = ?';
                getSpecificData(emailQuery, connection, [posterId]).then(function(rows) {
                    var data = rows[0];
                    var message = { //the mail that will be send to the user if the admin has deleted the poster
                        text: '',
                        from: 'CMD screens mail <matthias.d@outlook.com>',
                        to: 'someone <' + data.email + '>',
                        subject: 'Your content isn\'t accepted.',
                        attachment: [{
                            data: '<html> Hello ' + data.name + ', </br> </br>' + 'Your poster has been deleted trught the admin. Ask ' + req.session.name + ' why. </br>  </br> The CMD screens team' + '</html>',
                            alternative: true
                        }]
                    };
                    return message;

                }).then(function(message) {
                    //send the message to the user who's poster is deleted
                    sendMessage(message);

                }).catch(function(err) {
                    console.log(err); //log the error
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


router.post('/add', function(req, res) { // the admin/content/add post
    var body = req.body,
        general = {
            title: 'Add content'
        },
        data = { //the data for the error and the insert to the
            general: {
                id: randNumber(1000000),
                name: body.name,
                animation: body.animation,
                color: body.color,
                discription: body.discription,
                vimeoId: body.vimeoId,
                duration: body.duration,
                type: body.type,
                dateStart: confertDate(body.dateStart),
                dateEnd: confertDate(body.dateEnd),
                vimeoImage: '' || body.vimeoImage,
                upload: req.files,
                fileName: ''
            }
        },
        sqlQuery,
        sqlQuerySlideshow = 'INSERT INTO content_In_slideshow SET content_id = ?, slideshow_id = 613042, short = 100000000';

    //check if data is valid
    if (isValidDate(data.general.dateStart) && isValidDate(data.general.dateEnd)) {
        if (data.general.type !== null) {
            req.getConnection(function(err, connection) {
                if (req.editor || req.admin) { //if the user is a admin or an editor auto check the poster
                    sqlQuery = 'INSERT INTO content SET `userId` = ?, `id` = ?, `name` = ?, `discription` = ?, `animation` = ?, `color` = ?, `filename` = ?, `duration` = ?, `type` = ?, `dateStart` = ?, `dateEnd` = ?, `dataCreated` = now(), `checked` = 1,  `vimeoId` = ?, `vimeoImage` = ?';
                } else { //don't check the poster
                    sqlQuery = 'INSERT INTO content SET `userId` = ?, `id` = ?, `name` = ?, `discription` = ?, `animation` = ?, `color` = ?, `filename` = ?, `duration` = ?, `type` = ?, `dateStart` = ?, `dateEnd` = ?, `dataCreated` = now(), `vimeoId` = ?, `vimeoImage` = ?';
                }
                if (data.general.upload.imageFile) { //id the imageFile file var is defined add the filename var to the data.general.fileName
                    data.general.fileName = data.general.upload.imageFile.name;
                }

                insertData(sqlQuery, [req.session.user_id, data.general.id, data.general.name, data.generaldiscription, data.general.animation, data.general.color, data.general.fileName, data.general.duration, data.general.type, data.general.dateStart, data.general.dateEnd, data.general.vimeoId, data.general.vimeoImage], connection).then(function() {
                    //send a mail if the user is not a admin
                    if (!req.admin) {
                        var message = { //the message that will be send
                            text: '',
                            from: 'CMD screens mail <matthias.d@outlook.com>',
                            to: 'someone <matthias@dolstra.me',
                            subject: 'A new content needs to be checked',
                            attachment: [{
                                data: '<html> Hello ' + 'Matthias' + ', </br> </br>' + req.session.name + ' has uploaded a poster or vimeo movie. </br> </br> Please check the <a href="http://posters.dolstra.me/login">Website</a> for the content.  </br>  </br> <img src="http://posters.dolstra.me/download' + data.general.fileName + '" alt="uploaded poster" />  </br>  </br> The CMD screens team' + '</html>',
                                alternative: true
                            }]
                        };
                        sendMessage(message); //send the message
                    }
                    insertData(sqlQuerySlideshow, [data.general.id], connection).then(function() {
                        if (moment().isBetween(data.general.dateStart, data.general.dateEnd && req.admin)) { //refrech the slideshow if a admin adds a poster that should show now
                            sendRefresh('all', true);
                        }
                        res.redirect('/admin/content');
                    }).catch(function(err) {
                        console.log(err);
                        renderTemplate(res, req, 'admin/content/add', data, general, {}, 'There was a error' + err); //show the error to the user
                        throw err;
                    });
                }).catch(function(err) {
                    console.log(err);
                    renderTemplate(res, req, 'admin/content/add', data, general, {}, 'There was a error');
                    throw err;
                });
            });
        } else {
            renderTemplate(res, req, 'admin/content/add', data, general, {}, 'You have got no image uploaded');
        }
    } else {
        renderTemplate(res, req, 'admin/content/add', data, general, {}, 'You have submit a wrong date');
    }
});

router.post('/edit/:contentId', checkRightsEditor, function(req, res) {
    var updateSqlQuery = 'UPDATE content SET animation = ?, color = ?, duration = ?, dateStart = ?, dateEnd = ? WHERE id = ?',
        removeSqlQuery = 'DELETE FROM content_In_slideshow WHERE content_id = ? AND slideshow_id = ?',
        body = req.body,
        remove = body.remove,
        data = {
            animation: body.animation,
            duration: body.duration,
            dateStart: confertDate(body.dateStart),
            dateEnd: confertDate(body.dateEnd),
            color: body.color,
            contentId: req.params.contentId
        };
    if (isValidDate(data.dateStart) && isValidDate(data.dateEnd)) {
        req.getConnection(function(err, connection) {
            if (remove) { //if the remove button is clicked there will be a remove value then delete the poster from the slideshow
                insertData(removeSqlQuery, [data.contentId, '613042'], connection).then(function() {
                    res.redirect('/admin/slideshows/add/613042');
                }).catch(function(err) {
                    res.send('error:' + err);
                    console.log(err);
                    throw err;
                });
            } else { //change the values in the database
                insertData(updateSqlQuery, [data.animation, data.color, data.duration, data.dateStart, data.dateEnd, data.contentId], connection).then(function() {
                    res.redirect('/admin/slideshows/add/613042');
                }).catch(function(err) {
                    res.send('error:' + err);
                    console.log(err);
                    throw err;
                });
            }
        });
    }
});

module.exports = router;
