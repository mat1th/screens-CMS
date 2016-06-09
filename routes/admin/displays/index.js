var express = require('express'),
    checkLogin = require('../../middleware/checklogin.js'),
    checkRightsAdmin = require('../../middleware/checkRightsAdmin.js'),
    getData = require('../../../modules/getData.js'),
    insertData = require('../../../modules/insertData.js'),
    credentials = require('../../../modules/credentials.js'),
    randNumber = require('../../../modules/randNumber.js'),
    router = express.Router();


router.get('/', checkLogin, function(req, res) {
    res.redirect('/admin/slideshows');
});

router.get('/add', checkLogin, checkRightsAdmin, function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        editor = cr.editor,
        admin = cr.admin;

    getDisplayNames(req, res, false, login, admin, editor);
});

router.post('/add', checkLogin, checkRightsAdmin, function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        editor = cr.editor,
        body = req.body,
        name = body.name,
        slideshowId = body.slideshowId,
        now = new Date();

    if (name !== undefined && name.length !== 0 && slideshowId !== null) {
        req.getConnection(function(err, connection) {
            var sqlQuery = 'INSERT INTO displays SET ?',
                sqlValues = {
                    display_id: randNumber(1000),
                    name: name,
                    slideshowId: slideshowId,
                    dataCreated: now
                };

            // Insert the new photo data
            connection.query(sqlQuery, sqlValues, function(err) {
                if (err) {
                    throw err;
                }
                res.redirect('/admin/displays');
            });
        });
    } else {
        getDisplayNames(req, res, 'You haven\'t filled in a name', login, admin, editor);
    }
});

router.post('/edit', checkLogin, checkRightsAdmin, function(req, res) {
    var body = req.body,
        slideshowId = body.slideshowId,
        displaysChecked = body['displays[]'] || '',
        sqlDisplays = 'SELECT * FROM displays T1 LEFT JOIN slideshows T2 ON T1.slideshowId = T2.id',
        sqlUpdate = 'UPDATE displays SET `slideshowId` = ? WHERE display_id = ?';

    req.getConnection(function(err, connection) {

        getData(sqlDisplays, connection).then(function(rows) {
            var displaysUnchecked = [];
            rows.forEach(function(all) {
                if (typeof(displaysChecked) === 'string') {
                    if (checkSame(JSON.parse(displaysChecked), all.display_id)) {
                        insert(sqlUpdate, slideshowId, all.display_id);
                    } else {
                        var displayObject = {
                            id: all.display_id,
                            slideshow: all.slideshowId
                        };
                        displaysUnchecked.push(displayObject);
                    }
                } else if (typeof(displaysChecked) === 'object') {
                    displaysChecked.forEach(function(displayid) {
                        var id = JSON.parse(displayid);

                        if (checkSame(id, all.display_id)) {
                            insert(sqlUpdate, slideshowId, all.display_id);
                        } else {
                            var displayObject = {
                                id: all.display_id,
                                slideshow: all.slideshowId
                            };
                            contains(displayObject, displaysUnchecked);
                        }
                    });
                }
            });
            return displaysUnchecked;

        }).then(function(displaysUnchecked) {
            displaysUnchecked.forEach(function(display) {
                if (checkSame(display.slideshow, JSON.parse(slideshowId))) {
                    insert(sqlUpdate, '0', display.id);
                }
            });

        }).then(function() {
            res.redirect('/admin/slideshows/add'+ slideshowId);
        }).catch(function(err) {
            throw err;
        });

        // function contains(obj, objects) {
        //     var i, l = objects.length;
        //     console.log(l);
        //     for (i = 0; i < l; i++) {
        //         console.log('----');
        //         console.log(objects[i]);
        //         console.log(obj);
        //         console.log('----');
        //         if (objects[i] == obj) return true;
        //     }
        //     return false;
        // }

        function insert(sqlUpdate, slideshowId, displayid) {
            insertData(sqlUpdate, [slideshowId, displayid], connection).then(function() {
                console.log('done inser');
            }).catch(function(err) {
                console.log(err);
                throw err;
            });
        }

        function checkSame(var1, var2) {
            if (var1 === var2) {
                return true;
            } else {
                return false;
            }
        }
    });
});

function getDisplayNames(req, res, error, login, admin, editor) {
    req.getConnection(function(err, connection) {
        var sql = 'SELECT id, slideshow_name FROM slideshows';
        // Get the user id using username
        connection.query(sql, function(err, match) {
            if (err) {
                throw err;
            }
            res.render('admin/displays/add', {
                title: 'Add a display',
                rights: {
                    admin: admin,
                    logedin: login,
                    editor: editor
                },
                postUrl: '/admin/displays/add',
                error: error,
                data: match
            });
        });
    });
}


module.exports = router;
