var express = require('express'),
    credentials = require('../../../modules/credentials.js'),
    randNumber = require('../../../modules/randNumber.js'),
    getData = require('../../../modules/getData.js'),
    getSpecificData = require('../../../modules/getSpecificData.js'),
    insertData = require('../../../modules/insertData.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', function(req, res) {
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
            sqlDisplays = 'SELECT * FROM displays';
            // Get the user id using username
            getData(sql, connection).then(function(slideshows) {
                getData(sqlDisplays, connection).then(function(displays) {
                    var data = {
                        general: {
                            slideshows: slideshows,
                            displays: displays
                        }
                    };
                    //renderTemplate
                    if (slideshows.length > 0) {
                        renderTemplate(res, 'admin/slideshows/show', data, general, {}, false);
                    } else {
                        renderTemplate(res, 'admin/slideshows/show', data, general, {}, 'You don\' have any slideshows.');
                    }
                }).catch(function(err) {
                    throw err;
                });
                //
            }).catch(function(err) {
                throw err;
            });
        });
    } else {
        res.redirect('/admin');
    }
});

//create unique id and redirect
router.get('/add', function(req, res) {
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

router.get('/add/:slideshowId', function(req, res) {
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
            displays: '/admin/screens/edit'
        };

    if (general.admin || general.editor) {
        var sql = 'SELECT * FROM screens_In_slideshow T1 LEFT JOIN slideshows T2 ON T1.slideshow_id = T2.id LEFT JOIN screens T3 ON T1.screen_id = T3.id WHERE T1.slideshow_id = ? ORDER BY T1.short ASC';
        var sqlScreens = 'SELECT * FROM screens WHERE checked = 1';

        req.getConnection(function(err, connection) {
            getData(sqlScreens, connection).then(function(screens) {
                getSpecificData(sql, connection, [slideshowId]).then(function(rows) {
                    // if (rows.length > 0) {
                    var data = {
                        general: rows,
                        screens: screens
                    };
                    renderTemplate(res, 'admin/slideshows/add', data, general, postUrls, false);
                    // }
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

router.post('/add/:slideshowId', function(req, res) {
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
            res.send('succes');
        });
    } else {
        res.redirect('/admin');
    }
});

router.post('/add/settings/:slideshowId', function(req, res) {
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

module.exports = router;
