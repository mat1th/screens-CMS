var fs = require('fs'),
    express = require('express'),
    checklogin = require('../modules/checklogin.js'),
    router = express.Router();

router.get('/:photoName', function(req, res) {
    var filesPath = __dirname + '/../uploads/';
    var filePath = filesPath + req.params.photoName;

    fs.exists(filePath, function(exists) {
        if (exists) {
            res.sendFile(req.params.photoName, {
                root: filesPath
            });
        } else {
            res.send('No such file: ' + req.params.photoName);
        }
    });
});

// router.get('/:photoName', function(req, res) {
//     var filesPath = __dirname + '/../uploads/';
//     var filePath = filesPath + req.params.photoName;
//     req.getConnection(function(err, connection) {
//         var sql = 'SELECT filename FROM posters WHERE type = "poster"';
//         // Get the user id using username
//         connection.query(sql, function(err, match) {
//             if (err) {
//                 throw err;
//             }
//             if (match !== '' && match.length > 0) {
//                 res.sendFile(req.params.photoName, {
//                     root: filesPath
//                 });
//             } else {
//                 res.send('No such file: ' + req.params.photoName);
//             }
//         });
//     });
// });

module.exports = router;
