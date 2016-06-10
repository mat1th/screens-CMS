var express = require('express'),
    checkLogin = require('../../middleware/checklogin.js'),
    credentials = require('../../../modules/credentials.js'),
    randNumber = require('../../../modules/randNumber.js'),
    getData = require('../../../modules/getData.js'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    insertData = require('../../../modules/insertData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    sendRefresh = require('../../../modules/sendRefresh.js'),
    router = express.Router();


router.get('/', checkLogin, function(req, res) {

    var cr = credentials(req.session),
        general = {
            title: 'Your screens',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email
        },
        sql, sqlDisplays;

    if (general.admin || general.editor) {
        req.getConnection(function(err, connection) {
            sql = 'SELECT id, slideshow_name FROM slideshows';
            sqlDisplays = 'SELECT * FROM displays T1 LEFT JOIN slideshows T2 ON T1.slideshowId = T2.id';
            // Get the user id using username
            getData(sql, connection).then(function(slideshows) {
                getData(sqlDisplays, connection).then(function(displays) {
                    var data = {
                        general: {
                            slideshows: slideshows,
                            displays: displays
                        }
                    };

                    return data;
                }).then(function(data) {
                    //renderTemplate
                    if (slideshows.length > 0) {
                        renderTemplate(res, 'admin/slideshows/show', data, general, {}, false);
                    } else {
                        renderTemplate(res, 'admin/slideshows/show', data, general, {}, 'You don\' have any slideshows.');
                    }
                }).catch(function(err) {
                    throw err;
                });
            }).catch(function(err) {
                throw err;
            });
        });
    } else {
        res.redirect('/admin');
    }
});

//create unique id and redirect
router.get('/add', checkLogin, function(req, res) {
    var cr = credentials(req.session),
        email = cr.email,
        admin = cr.admin,
        editor = cr.editor,
        createSlideshow = 'INSERT INTO slideshows SET id = ?, slideshow_userId = (SELECT id FROM users WHERE email = ?)',
        number = randNumber(1000000);

    if (admin || editor) {
        req.getConnection(function(err, connection) {
            insertData(createSlideshow, [number, email], connection).then(function() {

                res.redirect('/admin/slideshows/add/' + number);

            }).catch(function(err) {
                throw err;
            });
        });
    }

});

router.get('/add/:slideshowId', checkLogin, function(req, res) {
    var cr = credentials(req.session),
        slideshowId = req.params.slideshowId,
        general = {
            title: 'Your screens',
            login: cr.login,
            admin: cr.admin,
            editor: cr.editor,
            email: cr.email,
            navStyle: 'icons-only'
        },
        postUrls = {
            settings: '/admin/slideshows/add/settings/' + slideshowId,
            screens: '/admin/screens/edit',
            displays: '/admin/displays/edit'
        };
    if (general.admin || general.editor) {
        var sql = 'SELECT * FROM screens_In_slideshow T1 LEFT JOIN slideshows T2 ON T1.slideshow_id = T2.id LEFT JOIN screens T3 ON T1.screen_id = T3.id WHERE T1.slideshow_id = ? ORDER BY T1.short ASC';
        var sqlScreens = 'SELECT * FROM screens WHERE checked = 1';
        var sqlDisplays = 'SELECT * FROM displays T1 LEFT JOIN slideshows T2 ON T1.slideshowId = T2.id';


        //could be written nicer
        req.getConnection(function(err, connection) {
            getData(sqlScreens, connection).then(function(screens) {
                getSpecificData(sql, connection, [slideshowId]).then(function(rows) {
                    var data = {
                        general: rows,
                        screens: screens
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

                        renderTemplate(res, 'admin/slideshows/add', data, general, postUrls, false);
                    }).catch(function(err) {
                        throw err;
                    });
                }).catch(function(err) {
                    throw err;
                });
            }).catch(function(err) {
                throw err;
            });
        });
    } else {
        res.redirect('/admin');
    }
});

router.post('/add/:slideshowId', checkLogin, function(req, res) {
    var cr = credentials(req.session),
        slideshowId = req.params.slideshowId,
        admin = cr.admin,
        editor = cr.editor,
        body = req.body,
        screens = JSON.parse('[' + body.screens + ']');

    if (admin || editor) {
        req.getConnection(function(err, connection) {
            var sqlQueryInsert = 'INSERT INTO screens_In_slideshow SET screen_id = ?, slideshow_id = ?, short = ?';
            var sqlQueryUpdate = 'UPDATE screens_In_slideshow SET short = ? WHERE screen_id = ? AND slideshow_id = ?';
            var sqlQueryGet = 'SELECT * FROM screens_In_slideshow WHERE screen_id = ? AND slideshow_id = ?';
            var getDisplays = 'SELECT display_id FROM displays WHERE slideshowId = ?';

            screens.forEach(function(screen, index) {
                getSpecificData(sqlQueryGet, connection, [screen, slideshowId]).then(function(rows) {
                    if (rows.length === 0) {
                        insertData(sqlQueryInsert, [screen, slideshowId, index], connection).then(function() {

                        }).catch(function(err) {
                            throw err;
                        });
                    } else {
                        insertData(sqlQueryUpdate, [index, screen, slideshowId], connection).then(function() {

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
                rows.forEach(function (display) {
                  var id = JSON.stringify(display.display_id);
                  sendRefresh(id, true);
                })
                //
            }).then(function() {
                res.send('succes');
            }).catch(function(err) {
                throw err;
            });


        });
    } else {
        res.redirect('/admin');
    }
});

router.post('/add/settings/:slideshowId', checkLogin, function(req, res) {
    var cr = credentials(req.session),
        slideshowId = req.params.slideshowId,
        admin = cr.admin,
        editor = cr.editor,
        body = req.body,
        discription = body.discription,
        name = body.name;

    if (admin || editor) {
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
    } else {
        res.redirect('/admin');
    }
});

router.get('/preview/:slideshowId', function(req, res) {
    var slideshowId = req.params.slideshowId,
        general = {
            title: 'Slideshow ' + slideshowId
        };

    req.getConnection(function(err, connection) {
        var sql = 'SELECT * FROM slideshows T1 LEFT JOIN screens_In_slideshow T2 ON T1.id = T2.slideshow_id LEFT JOIN screens T3 ON T2.screen_id = T3.id WHERE T1.id = ? ORDER BY T2.short ASC';
        // var sqlOud = 'SELECT * FROM (SELECT slideshowId FROM displays WHERE display_id = ? ) T1 LEFT JOIN screens_In_slideshow T2  ON T1.slideshowId = T2.slideshow_id LEFT JOIN screens T3 ON T3.id = T2.screen_id WHERE dateStart < CURDATE() AND dateEnd > CURDATE()';

        getSpecificData(sql, connection, [slideshowId]).then(function(rows) {
            var data = {
                general: rows
            };
            if (rows.length > 0) {
                renderTemplate(res, 'display/view', data, general, {}, false, 'layout2');
            } else {
                renderTemplate(res, 'display/view', {}, general, {}, 'There are no screens in your slideshow', 'layout2');
            }

        }).catch(function(err) {
            throw err;
        });
    });
});

module.exports = router;
