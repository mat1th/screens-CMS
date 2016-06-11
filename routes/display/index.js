var express = require('express'),
    getSpecificData = require('../../modules/getSpecificData.js'),
    renderTemplate = require('../../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/admin/displays');
});


router.get('/:displayId', function(req, res) {
    var displayId = req.params.displayId,
        general = {
            title: 'Display ' + displayId
        };
    req.getConnection(function(err, connection) {
        var sql = 'SELECT * FROM (SELECT slideshowId FROM displays WHERE display_id = ? ) T1 LEFT JOIN screens_In_slideshow T2  ON T1.slideshowId = T2.slideshow_id LEFT JOIN screens T3 ON T3.id = T2.screen_id ORDER BY T2.short ASC';

        getSpecificData(sql, connection, [displayId]).then(function(rows) {
            var data = {
                general: rows,
                specificId: displayId
            };
            if (rows.length > 0 && rows[0].slideshow_id !== null) {
                renderTemplate(res, 'display/view', data, general, {}, false, 'layout2');
            } else {
                renderTemplate(res, 'display/view', data, general, {}, 'There are no screens in your slideshow this is display' + displayId, 'layout2');
            }
        }).catch(function(err) {
            throw err;
        });
    });
});

module.exports = router;
