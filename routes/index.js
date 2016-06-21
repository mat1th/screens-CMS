var express = require('express'),
    renderTemplate = require('../modules/renderTemplate.js'),
    router = express.Router();

router.get('/', function(req, res) { //render the home page
    var general = {
        title: 'Home',
        pagelayout: 'transparant'
    };
    renderTemplate(res, req, 'home', {}, general, {}); //render the tepmlate
});

module.exports = router;
