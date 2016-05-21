var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');

// GET a photo and present the full photo page
router.get('/', function(req, res) {
  console.log(req.getConnection);
    req.getConnection(function(err, connection) {
        if (err) return next(err);

        var sql = 'SELECT id, discription, duration FROM dias';
        // Get the photo id and caption using the photo name
        connection.query(sql, function(err, match) {
          console.log(match);
            if (err) {
                throw err;
            } else if (match !== '' && match.length > 0) {
                console.log(match);
                // photoId = match[0].id;
                // photoCaption = match[0].caption;
                // userId = match[0].user_id;
            } else {
                res.send('No such file: ' + req.params.photoName);
            }
        });
    });
});

module.exports = router;
