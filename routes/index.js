var fs = require('fs'),
    express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home', {
      title: 'Home',
      data: 'hio'
  });
});

module.exports = router;
