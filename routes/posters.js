var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    checklogin = require('../modules/checklogin.js'),
    moment = require('moment');

// GET a poster and present the full poster page
router.get('/:posterId', function(req, res) {
    req.getConnection(function(err, connection) {
        if (err) return next(err);
        var posterId = req.params.posterId;
        var sql = 'SELECT id, discription, duration, animation, filename, type, date_begin, date_end, date_created FROM posters WHERE id = ?';
        // Get the photo id and caption using the photo name
        connection.query(sql, [posterId], function(err, match) {
            console.log(match[0]);
            if (err) {
                throw err;
            } else if (match !== '' && match.length > 0) {
                var data = {
                    id: match[0].id,
                    discription: match[0].discription,
                    duration: match[0].duration,
                    animation: match[0].animation,
                    filename: match[0].filename,
                    type: match[0].type,
                    date_begin: moment(match[0].date_begin).format('LL'),
                    date_end: moment(match[0].date_end).format('LL'),
                    date_created: moment(match[0].date_created).startOf('day').fromNow()
                }
                res.render('posters', {
                    title: 'Posters',
                    logedin: checklogin(req.session),
                    data: data
                });
            } else {
                res.send('No such poster: ' + posterId);
            }
        });
    });
});

module.exports = router;
