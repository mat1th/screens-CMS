var express = require('express'),
    getSpecificData = require('../../modules/getSpecificData.js'),
    renderTemplate = require('../../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', function(req, res) { //if ther is no id defined render the displays page
    res.redirect('/admin/displays');
});

router.get('/:displayId', function(req, res) {
    var displayId = req.params.displayId,
        general = {
            title: 'Display ' + displayId
        };
    req.getConnection(function(err, connection) {
        //only show slides that are checked and that are between the start and end date
        var sql = 'SELECT * FROM (SELECT slideshowId FROM displays WHERE display_id = ? ) T1 LEFT JOIN content_In_slideshow T2  ON T1.slideshowId = T2.slideshow_id LEFT JOIN content T3 ON T3.id = T2.content_id  WHERE dateStart < CURDATE() AND dateEnd > CURDATE() AND checked = 1 ORDER BY T2.short ASC';

        getSpecificData(sql, connection, [displayId]).then(function(rows) {
            var data = {
                general: rows,
                specificId: displayId
            };
            if (rows.length > 0 && rows[0].slideshow_id !== null) {
                //render the template with the content
                renderTemplate(res, req, 'display/view', data, general, {}, false, 'layout2');
            } else {
                //show a arror that there is no content for this display and use layout 2
                renderTemplate(res, req, 'display/view', data, general, {}, 'There are no content in your slideshow this is display' + displayId, 'layout2');
            }
        }).catch(function(err) {
            renderTemplate(res, req, 'display/view', {}, general, {}, 'There went somthing wrong with getting the data.', 'layout2');
            throw err;
        });
    });
});

module.exports = router;
