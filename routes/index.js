var fs = require('fs'),
    express = require('express'),
    checklogin = require('../modules/checklogin.js'),
    router = express.Router();

router.get('/', function(req, res, next) {
    res.render('home', {
        title: 'Home',
        navPosition: 'home',
        logedin: checklogin(req.session),
        data: 'hio'
    });
});

module.exports = router;
