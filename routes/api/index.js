var express = require('express'),
    credentials = require('../../modules/credentials.js'),
    router = express.Router();

router.get('/slideshows/:slideshowId', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        slideshowId = req.params.slideshowId,
        unusedposters = [];

    if (login && admin) {
        req.getConnection(function(err, connection) {
            var sqlPosters = 'SELECT filename, type, name,animation, duration, dateStart,dateEnd, id FROM posters';
            connection.query(sqlPosters, function(err, postersMatch) {
                if (err) throw err;

                var sqlSlideshows = 'SELECT posters, id, name FROM slideshows WHERE id = ?';
                connection.query(sqlSlideshows, [slideshowId], function(err, slideshowMatch) {
                    if (err) throw err;

                    var AllPosters = JSON.parse(slideshowMatch[0].posters);
                    AllPosters.forEach(function(singlePoster) {
                        postersMatch.forEach(function(poster) {
                            if (singlePoster === poster.id) {
                                unusedposters.push(poster);
                            }
                        });
                    });
                    res.send(unusedposters);
                });
            });
        });
    } else {
        res.send('You are not authenticated!');
    }
});

//show all the
// router.get('/slideshows/:slideshowId', function(req, res) {
//     var cr = credentials(req.session),
//         login = cr.login,
//         admin = cr.admin,
//         slideshowId = req.params.slideshowId;
//
//     if (login && admin) {
//         req.getConnection(function(err, connection) {
//             var sqlSlideshows = 'SELECT posters, id, name FROM slideshows WHERE id = ?';
//             connection.query(sqlSlideshows, [slideshowId], function(err, match) {
//                 if (err) throw err;
//                 res.send(match);
//             });
//         });
//     } else {
//         res.send('You are not authenticated!');
//     }
// });

module.exports = router;
