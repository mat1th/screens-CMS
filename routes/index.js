var fs = require('fs'),
    express = require('express'),
    credentials = require('../modules/credentials.js'),
    renderTemplate = require('../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login;

    res.render('home', {
        title: 'Home',
        pagelayout: 'transparant',
        rights: {
            logedin: login
        },
        styleCookie: req.cookies.style
    });
});

module.exports = router;
