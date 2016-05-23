var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');

// GET a photo and present the full photo page
router.get('/', function(req, res) {
    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var sql = 'SELECT id, discription, duration FROM posters';
        // Get the photo id and caption using the photo name
        connection.query(sql, function(err, match) {
            if (err) {
                throw err;
            } else if (match !== '' && match.length > 0) {
                var diaId = match[0].id,
                    diaDiscription = match[0].discription,
                    diaduration = match[0].duration;
                    console.log(match);
                res.render('posters', {
                    title: 'Posters',
                    diaId: diaId,
                    diaDiscription: diaDiscription,
                    diaduration: diaduration
                });
            } else {
                res.send('No such dia: ');
            }
        });
    });
});

module.exports = router;
