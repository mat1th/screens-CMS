var express = require('express'),
    moment = require('moment'),
    credentials = require('../../modules/credentials.js'),
    router = express.Router();

//set up moment localization    
require('moment/locale/cs');
moment.locale('nl');


//get data from poster
router.get('/poster/:posterId', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        posterId = req.params.posterId;

    if (login && admin) {
        req.getConnection(function(err, connection) {
            var sqlSlideshows = 'SELECT filename, name,animation, duration, dateStart,dateEnd, id FROM posters WHERE id = ?';
            connection.query(sqlSlideshows, [posterId], function(err, match) {
                if (err) throw err;
                console.log(match);
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
    } else {
        res.send('You are not authenticated!');
    }
});

module.exports = router;
