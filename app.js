//load packages
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    path = require('path'),
    http = require('http').Server(app),
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    multer = require('multer'),
    mysql = require('mysql'),
    hbs = require('hbs'),
    cookieParser = require('cookie-parser'),
    myConnection = require('express-myconnection'),
    //own modules
    generateUUID = require('./modules/generateUUID.js'),
    //get files for routes for not loged in
    index = require('./routes/index'),
    // get files for login
    userAcounts = require('./routes/users/users'),
    //get files for admin
    dashboard = require('./routes/admin/index'),
    displaysAdmin = require('./routes/admin/displays/index'),
    content = require('./routes/admin/content/index'),
    slideshows = require('./routes/admin/slideshows/index'),
    display = require('./routes/display/index'),
    users = require('./routes/admin/users/index'),
    api = require('./routes/api/index');

//import config
require('./config/config.js')({
    key: 'pinpoint',
    port: 3010,
    base: '/'
});
// inport libs
require('./lib/hsbHelper.js'); //register hbs helpers
require('./lib/socketConnection.js')(http); //starting web socket

//set vieuw enging
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials'); //register hbs partials

//define body parser
app.use(bodyParser.urlencoded({
    extended: false
})); //set body parser for the post requests
app.use(bodyParser.json()); //create json from body

//define cookies
app.use(cookieParser()); //enable cookies
// app.use('/', function(req, res, next) {
//     console.log('cookie');
//     next();
// });

//define static paths
app.use(express.static(path.join(__dirname, 'public/dist')));
app.use('/download', express.static(path.join(__dirname, 'uploads')));

//dont serve on / and '' the same content but redirect for search engine
app.use(function(req, res, next) {
    if (req.url.substr(-1) == '/' && req.url.length > 1) {
        res.redirect(301, req.url.slice(0, -1));
    } else {
        next();
    }
});
// Add session support
app.use(session({
    secret: config.session.secret,
    genid: function(req) {
        return generateUUID() // use UUIDs for session IDs
    },
    store: new FileStore(), //store the session in a file
    saveUninitialized: true,
    resave: false
}));

// Setup Multer to accept uploads
app.use(multer({
    dest: './uploads/',
    // If file that is to be uploaded is not an image don't upload
    onFileUploadStart: function(file) {
        if (file.mimetype.indexOf('image') === -1) {
            return false;
        }
    }
}));

//connection database
var dbOptions = {
    host: config.dbOptions.host,
    user: config.dbOptions.user,
    password: config.dbOptions.password,
    database: config.dbOptions.database,
    port: config.dbOptions.port
};

// Add connection middleware
app.use(myConnection(mysql, dbOptions, 'single'));


//check if the user is loged in
app.use('/admin', function(req, res, next) {
    var userId = req.session.user_id;
    if (userId === null || userId === undefined) { //check if a user id is set if not go to the login page
        res.redirect('/users/login');
    } else {
        req.userId = userId;
        next();
    }
});

//use routes
app.use('/', index);
// get files for login
app.use('/users', userAcounts);
//get files for admin
app.use('/admin', dashboard);
app.use('/admin/displays', displaysAdmin);
app.use('/admin/content', content);
app.use('/admin/slideshows', slideshows);
app.use('/admin/users', users);
//get files for slidewhows
app.use('/display', display);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
        message: err.message,
        error: err
    });
    next(err);
});

// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.listen(config.app.port, function() {
    console.log('listening on *:' + config.app.port);
});
