var fs = require('fs'),
    express = require('express'),
    checklogin = require('../modules/checklogin.js')
router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.email) {
        res.render('edit/edit', {
            title: 'Home',
            logedin: checklogin(req.session),
            data: 'hio'
        });
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;
