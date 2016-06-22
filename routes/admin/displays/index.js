var express = require('express'),
    checkRightsAdmin = require('../../middleware/checkRightsAdmin.js'),
    getData = require('../../../modules/getData.js'),
    // insertData = require('../../../modules/insertData.js'),
    randNumber = require('../../../modules/randNumber.js'),
    renderTemplate = require('../../../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', checkRightsAdmin, function(req, res) {
    var general = {
            title: 'Displays'
        },
        sqlDisplays;

    req.getConnection(function(err, connection) {

        sqlDisplays = 'SELECT * FROM displays T1 LEFT JOIN slideshows T2 ON T1.slideshowId = T2.id'; //select all displays
        // Get the user id using username
        getData(sqlDisplays, connection).then(function(displays) {
            return {
                general: {
                    displays: displays
                }
            };
        }).then(function(data) {
            //render the template
            renderTemplate(res, req, 'admin/displays/show', data, general, {}, false);

        }).catch(function(err) {
            renderTemplate(res, req, 'admin/displays/show', {}, general, {}, 'There was a error with getting the data');
            throw err;
        });

    });

});

router.get('/add', checkRightsAdmin, function(req, res) { //render the admin/displays/add tempate
    getDisplayNames(req, res, false);
});

router.post('/add', checkRightsAdmin, function(req, res) { //post to the admin/displays/add tempate
    var body = req.body,
        name = body.name,
        location = body.location,
        slideshowId = 613042,
        now = new Date();

    if (name !== undefined && name.length !== 0 && location !== null) { //check if the values are not undefined
        req.getConnection(function(err, connection) {
            var sqlQuery = 'INSERT INTO displays SET ?', //insert query for the database
                sqlValues = {
                    display_id: randNumber(1000),
                    name: name,
                    slideshowId: slideshowId,
                    location: location,
                    dataCreated: now
                };

            // Insert the new photo data
            connection.query(sqlQuery, sqlValues, function(err) {
                if (err) {
                    throw err;
                }
                res.redirect('/admin/displays'); //redirect to the displays overvieuw
            });
        });
    } else {
        getDisplayNames(req, res, 'You haven\'t filled in a name');
    }
});

// router.post('/edit', checkRightsAdmin, function(req, res) { (now not used in the new flow)
//     var body = req.body, //get the post request
//         slideshowId = body.slideshowId,
//         displaysChecked = body['displays[]'] || '', //get the array of displays
//         sqlDisplays = 'SELECT * FROM displays T1 LEFT JOIN slideshows T2 ON T1.slideshowId = T2.id',
//         sqlUpdate = 'UPDATE displays SET `slideshowId` = ? WHERE display_id = ?';
//
//     req.getConnection(function(err, connection) { //get the myqsl connection
//         getData(sqlDisplays, connection).then(function(rows) {
//             var displaysUnchecked = [];
//             rows.forEach(function(all) { //loop trught the displays
//                 if (typeof(displaysChecked) === 'string') { //if the displays is  a sting (so there is only one display checked)
//                     if (checkSame(JSON.parse(displaysChecked), all.display_id)) { //check if they are the same as the current display
//                         insert(sqlUpdate, slideshowId, all.display_id); // if they are the same insert it to the databasae
//                     } else {
//                         var displayObject = { //create a object with not the same data
//                             id: all.display_id,
//                             slideshow: all.slideshowId
//                         };
//                         displaysUnchecked.push(displayObject); // add it to the array of unchecked displays
//                     }
//                 } else if (typeof(displaysChecked) === 'object') { //if there are more dispalys checkt it would be a []
//                     displaysChecked.forEach(function(displayid) {
//                         var id = JSON.parse(displayid);
//
//                         if (checkSame(id, all.display_id)) { //if they are the same
//                             insert(sqlUpdate, slideshowId, all.display_id); // if they are the same insert it to the databasae
//                         } else {
//                             var displayObject = { //create a object with not the same data
//                                 id: all.display_id,
//                                 slideshow: all.slideshowId
//                             };
//                             contains(displayObject, displaysUnchecked);
//                         }
//                     });
//                 }else {
//                   //ther is a stange error
//                 }
//             });
//             return displaysUnchecked;
//
//         }).then(function(displaysUnchecked) { //if the loop is finished the displaysChecked dispays will be checked if they have an another id or the same slieshow id
//             displaysUnchecked.forEach(function(display) {
//                 if (checkSame(display.slideshow, JSON.parse(slideshowId))) { // if they have the same sideshow id insert a 0 sildeshow so there is no silideshow on it
//                     insert(sqlUpdate, '0', display.id);
//                 }
//             });
//
//         }).then(function() {
//             res.redirect('/admin/slideshows/add' + slideshowId); //redirect to the sideshow
//         }).catch(function(err) {
//             throw err;
//         });
//
//         var contains = function (obj, objects) { //check if it contains
//             var i, l = objects.length;
//             for (i = 0; i < l; i++) {
//                 if (objects[i] === obj) return true;
//             }
//             return false;
//         };
//         //insert the new data into the database
//         var insert = function (sqlUpdate, slideshowId, displayid) {
//             insertData(sqlUpdate, [slideshowId, displayid], connection).then(function() {
//                 console.log('done insert'); //the insert is done
//             }).catch(function(err) {
//                 console.log(err);
//                 throw err;
//             });
//         };
//
//         var checkSame = function (var1, var2) { //check if two values are the same
//             if (var1 === var2) {
//                 return true;
//             } else {
//                 return false;
//             }
//         };
//     });
// });

var getDisplayNames = function(req, res, error) { // a function to display the page
    req.getConnection(function(err, connection) {
        var sql = 'SELECT id, slideshow_name FROM slideshows',
            general = {
                title: 'Add a display'
            },
            postUrls = {
                general: '/admin/displays/add'
            };
        // Get the user id using username
        connection.query(sql, function(err, match) {
            if (err) throw err;

            var data = {
                general: match
            };
            renderTemplate(res, req, 'admin/displays/add', data, general, postUrls, error); //render the tepmlate
        });
    });
};

module.exports = router;
