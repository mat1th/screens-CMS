var express = require('express'),
    fs = require('fs'),
    checkLogin = require('../../middleware/checklogin.js'),
    checkRightsEditor = require('../../middleware/checkRightsEditor.js'),
    credentials = require('../../../modules/credentials.js'),
    randNumber = require('../../../modules/randNumber.js'),
    getData = require('../../../modules/getData.js'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    insertData = require('../../../modules/insertData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    sendRefresh = require('../../../modules/sendRefresh.js'),
    router = express.Router();

router.get('/', checkLogin, checkRightsEditor, function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Your content',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor
        },
        sql, sqlDisplays;

    req.getConnection(function(err, connection) {
        sql = 'SELECT * FROM slideshows';
        sqlDisplays = 'SELECT * FROM displays T1 LEFT JOIN slideshows T2 ON T1.slideshowId = T2.id';
        // Get the user id using username
        getData(sql, connection).then(function(slideshows) {
            getData(sqlDisplays, connection).then(function(displays) {
                return {
                    general: {
                        slideshows: slideshows,
                        displays: displays
                    }
                };
            }).then(function(data) {
                //renderTemplate
                if (slideshows.length > 0) {
                    renderTemplate(res, req, 'admin/slideshows/show', data, general, {}, false);
                } else {
                    renderTemplate(res, req, 'admin/slideshows/show', data, general, {}, 'You don\' have any slideshows.');
                }
            }).catch(function(err) {
                throw err;
            });
        }).catch(function(err) {
            throw err;
        });
    });

});

//create unique id and redirect
router.get('/add', checkLogin, checkRightsEditor, function(req, res) {
    var userID = req.session.user_id,
        createSlideshow = 'INSERT INTO slideshows SET id = ?, slideshow_userId = ?',
        number = randNumber(1000000);

    req.getConnection(function(err, connection) {
        insertData(createSlideshow, [number, userID], connection).then(function() {
            res.redirect('/admin/slideshows/add/' + number);
        }).catch(function(err) {
            throw err;
        });
    });
});

router.get('/add/:slideshowId', checkLogin, checkRightsEditor, function(req, res) {
    var cr = credentials(req.session),
        slideshowId = req.params.slideshowId,
        general = {
            title: 'Your content',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            navStyle: 'icons-only'
        },
        postUrls = {
            settings: '/admin/slideshows/add/settings/' + slideshowId,
            content: '/admin/content/edit',
            displays: '/admin/displays/edit'
        },
        sql = 'SELECT * FROM content_In_slideshow T1 LEFT JOIN slideshows T2 ON T1.slideshow_id = T2.id LEFT JOIN content T3 ON T1.content_id = T3.id WHERE T1.slideshow_id = 613042 AND dateStart < CURDATE() AND dateEnd > CURDATE() ORDER BY T1.short ASC',
        sqlContent = 'SELECT * FROM content WHERE checked = 1 AND dateStart < CURDATE() AND dateEnd > CURDATE()',
        sqlDisplays = 'SELECT * FROM displays T1 LEFT JOIN slideshows T2 ON T1.slideshowId = T2.id';

    //could be written nicer
    req.getConnection(function(err, connection) {
        getData(sqlContent, connection).then(function(content) {
            getSpecificData(sql, connection, [slideshowId]).then(function(rows) {
                var data = {
                    general: rows,
                    content: content
                };
                return data;
            }).then(function(data) {
                getSpecificData(sqlDisplays, connection, [slideshowId]).then(function(rows) {
                    data.displays = rows;
                    data.specificId = slideshowId;
                    // return the data
                    return data;
                }).then(function(data) {
                    //render template
                    renderTemplate(res, req, 'admin/slideshows/add', data, general, postUrls, false);
                }).catch(function(err) {
                    renderError(err);
                    throw err;
                });
            }).catch(function(err) {
                renderError(err);
                throw err;
            });
        }).catch(function(err) {
            renderError(err);
            throw err;
        });

        function renderError(err) {
            console.log(err);
            renderTemplate(res, req, 'admin/slideshows/add', {}, general, postUrls, 'There was a error, please refrech the browser');
        }
    });
});

router.post('/add/:slideshowId', checkLogin, checkRightsEditor, function(req, res) {
    var slideshowId = req.params.slideshowId,
        body = req.body,
        content = JSON.parse('[' + body.content + ']');

    req.getConnection(function(err, connection) {
        var sqlQueryInsert = 'INSERT INTO content_In_slideshow SET content_id = ?, slideshow_id = ?, short = ?';
        var sqlQueryUpdate = 'UPDATE content_In_slideshow SET short = ? WHERE content_id = ? AND slideshow_id = ?';
        var sqlQueryGet = 'SELECT * FROM content_In_slideshow WHERE content_id = ? AND slideshow_id = ?';
        var getDisplays = 'SELECT display_id FROM displays WHERE slideshowId = ?';

        content.forEach(function(content, index) {
            getSpecificData(sqlQueryGet, connection, [content, slideshowId]).then(function(rows) {
                if (rows.length === 0) {
                    insertData(sqlQueryInsert, [content, slideshowId, index], connection).then(function() {

                    }).catch(function(err) {
                        throw err;
                    });
                } else {
                    insertData(sqlQueryUpdate, [index, content, slideshowId], connection).then(function() {

                    }).catch(function(err) {
                        throw err;
                    });
                }
            }).catch(function(err) {
                res.send('error', err);
                throw err;
            });
        });
        getSpecificData(getDisplays, connection, [slideshowId]).then(function(rows) {
            rows.forEach(function(display) {
                var id = JSON.stringify(display.display_id);
                sendRefresh(id, true);
            });
        }).then(function() {
            res.send('succes');
        }).catch(function(err) {
            throw err;
        });
    });

});

router.post('/add/settings/:slideshowId', checkLogin, checkRightsEditor, function(req, res) {
    var slideshowId = req.params.slideshowId,
        body = req.body,
        discription = body.discription,
        name = body.name;

    req.getConnection(function(err, connection) {
        var sqlQueryInsert = 'UPDATE slideshows SET slideshow_discription = ?, slideshow_name = ? WHERE id = ?';

        insertData(sqlQueryInsert, [discription, name, slideshowId], connection).then(function() {
            res.redirect('/admin/slideshows/add/' + slideshowId);
        }).catch(function(err) {
            console.log(err);
            res.send('err' + err);
            throw err;
        });
    });
});

router.get('/preview/:slideshowId', checkLogin, checkRightsEditor, function(req, res) {
    var slideshowId = req.params.slideshowId,
        general = {
            title: 'Slideshow ' + slideshowId
        },
        //only show slides that are checked and that are between the start and end date
        sql = 'SELECT * FROM slideshows T1 LEFT JOIN content_In_slideshow T2 ON T1.id = T2.slideshow_id LEFT JOIN content T3 ON T2.content_id = T3.id WHERE T1.id = ? AND dateStart < CURDATE() AND dateEnd > CURDATE() ORDER BY T2.short ASC ';

    req.getConnection(function(err, connection) {
        getSpecificData(sql, connection, [slideshowId]).then(function(rows) {
            var data = {
                general: rows
            };
            if (rows.length > 0) {
                renderTemplate(res, req, 'display/view', data, general, {}, false, 'layout2');
            } else {
                renderTemplate(res, req, 'display/view', {}, general, {}, 'There is no content in your slideshow', 'layout2');
            }
        }).catch(function(err) {
            renderTemplate(res, req, 'display/view', {}, general, {}, 'There was a error', 'layout2');
            throw err;
        });
    });
});

router.get('/content/:slideshowId', checkLogin, function(req, res) {
    var slideshowId = req.params.slideshowId,
        filesPath = __dirname + '/../../../uploads/',
        notfoundPath = __dirname + '/../../../public/dist/img/',
        noPosterPath = notfoundPath + 'no-screen.jpg',
        sql = "SELECT * FROM slideshows T1 LEFT JOIN content_In_slideshow T2  ON T1.id = T2.slideshow_id LEFT JOIN content T3 ON T2.content_id = T3.id WHERE type = 'poster' AND slideshow_id = ? ORDER BY T2.short ASC LIMIT 1";

    req.getConnection(function(err, connection) {
        getSpecificData(sql, connection, [slideshowId]).then(function(rows) {
            if (rows.length > 0) {
                var filename = rows[0].filename;
                var filePath = filesPath + filename;

                fs.exists(filePath, function(exists) {
                    if (exists) {
                        res.sendFile(filename, {
                            root: filesPath
                        });
                    } else {
                        res.send('No such file: ' + filename);
                    }
                });
            } else {
                fs.exists(noPosterPath, function(exists) {

                    if (exists) {
                        res.sendFile('no-screen.jpg', {
                            root: notfoundPath
                        });
                    }
                });
            }
        }).catch(function(err) {
            res.send('error: ' + err);
            throw err;
        });
    });
});

module.exports = router;
