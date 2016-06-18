var fs = require('fs'),
    express = require('express'),
    credentials = require('../modules/credentials.js'),
    router = express.Router();

router.get('/', function(req, res, next) {
    var cr = credentials(req.session),
        login = cr.login;
        
    res.render('home', {
        title: 'Home',
        pagelayout: 'transparant',
        rights: {
            logedin: login
        }
    });
});

module.exports = router;
