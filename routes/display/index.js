var fs = require('fs'),
    express = require('express'),
    moment = require('moment'),
    checklogin = require('../../modules/checklogin.js'),
    isValidDate = require('../../modules/isValidDate.js'),
    router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect('/admin/displays');
});

router.get('/:displayId', function(req, res, next) {
    var displayId = req.params.displayId;
    var login = checklogin(req.session)
    var posterUrls = [];
    if (login) {
        req.getConnection(function(err, connection) {
            var sqlGetFilname = 'SELECT filename FROM posters WHERE '
            var sql = 'SELECT posters FROM slideshows WHERE id IN( SELECT slideshow_id FROM displays WHERE id = ? )';
            // Get the user id using username
            connection.query(sql, [displayId], function(err, match) {
                if (err) {
                    throw err;
                }
                if (match !== '' && match.length > 0) {
                    var posterIds = JSON.parse(match[0].posters);
                    //create string for posters
                      var sqlGetFilname = 'SELECT filename FROM posters WHERE '
                    posterIds.forEach(function(currentValue, index) {
                        if (index === posterIds.length - 1) {
                            sqlGetFilname += 'id = ' + currentValue;
                        } else {
                            sqlGetFilname += 'id = ' + currentValue + ' OR ';
                        }
                    });
                    connection.query(sqlGetFilname, function(err, match) {
                        if (err) {
                            throw err;
                        }
                        if (match !== '' && match.length > 0) {
                            res.render('display/view', {
                                title: 'Display ' + displayId,
                                layout: 'layout/layout2',
                                logedin: login,
                                data: match
                            });
                        } else {
                            res.render('admin/slideshows/show', {
                                title: 'Display ' + displayId,
                                logedin: checklogin(req.session),
                                error: 'There are no posters in your slideshow',
                                data: match
                            });
                        }
                    });

                } else {
                    res.render('admin/slideshows/show', {
                        title: 'Display ' + displayId,
                        logedin: checklogin(req.session),
                        error: 'This display does not exsist ',
                        data: match
                    });
                }
            });
        });
    } else {
        res.redirect('/users/login');
    }
});




// router.get('/:displayID', function(req, res, next) {

//         req.getConnection(function(err, connection) {
//             var sql = 'SELECT id, discription, posters FROM slideshows';
//             // Get the user id using username
//             connection.query(sql, function(err, match) {
//                 if (err) {
//                     throw err;
//                 }
//
//                 if (match !== '' && match.length > 0) {
//                     res.render('admin/slideshows/show', {
//                         title: 'Home',
//                         logedin: checklogin(req.session),
//                         data: match
//                     });
//                 }else{
//                   res.render('admin/slideshows/show', {
//                       title: 'Home',
//                       logedin: checklogin(req.session),
//                       error: 'You have no displays jet',
//                       data: match
//                   });
//                 }
//             });
//         });

// });

module.exports = router;
