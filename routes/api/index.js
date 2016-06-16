var express = require('express'),
    moment = require('moment'),
    checkLogin = require('../middleware/checklogin.js'),
    credentials = require('../../modules/credentials.js'),
    router = express.Router();

//set up moment localization
require('moment/locale/nl');
moment.locale('nl');


//get data from content
router.get('/content/:contentId', checkLogin, function(req, res) {
    var contentId = req.params.contentId;

    req.getConnection(function(err, connection) {
        var sqlSlideshows = 'SELECT filename, name,animation, duration, dateStart,dateEnd, id FROM content WHERE id = ?';
        connection.query(sqlSlideshows, [contentId], function(err, match) {
            if (err) throw err;
            var data = {
                filename: match[0].filename,
                name: match[0].name,
                animation: match[0].animation,
                duration: match[0].duration,
                dateStart: moment(match[0].dateStart).format('L'),
                dateEnd: moment(match[0].dateEnd).format('L'),
                id: match[0].id
            };
            res.send(JSON.stringify(data));
        });
    });

});

module.exports = router;
