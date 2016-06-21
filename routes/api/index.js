var express = require('express'),
    moment = require('moment'),
    router = express.Router();

//set up moment localization
require('moment/locale/nl');
moment.locale('nl'); //localization to nl


//get data from content
router.get('/content/:contentId', function(req, res) { //the route /api/content/id
    var contentId = req.params.contentId; //get the id param

    req.getConnection(function(err, connection) {
        var sqlSlideshows = 'SELECT filename, name,animation, duration, color, dateStart, dateEnd, id FROM content WHERE id = ?'; //get the data from the database
        connection.query(sqlSlideshows, [contentId], function(err, match) {
            if (err) throw err;
            var data = {
                filename: match[0].filename,
                name: match[0].name,
                animation: match[0].animation,
                duration: match[0].duration,
                color: match[0].color,
                dateStart: moment(match[0].dateStart).format('L'), //format the date
                dateEnd: moment(match[0].dateEnd).format('L'), //format the date
                id: match[0].id
            };
            res.send(JSON.stringify(data)); //send a json object
        });
    });
});

module.exports = router;
