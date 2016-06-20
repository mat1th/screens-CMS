var express = require('express'),
    credentials = require('../modules/credentials.js'),
    router = express.Router();

router.get('/', function(req, res) {
    var cr = credentials(req.session),
        admin = cr.admin,
        login = cr.login;

    res.render('home', { //render the home page
        title: 'Home',
        pagelayout: 'transparant',
        rights: {
            logedin: login,
            admin: admin
        },
        styleCookie: req.cookies.style
    });
});

module.exports = router;
