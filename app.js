//load packages
const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    bodyParser = require('body-parser'),
    https = require('https'),
    fs = require('fs'),
    multer = require('multer'),
    mysql = require('mysql'),
    hbs = require('hbs'),
    Promise = require('bluebird'),
    myConnection = require('express-myconnection'),
    //own modules
    generateUUID = require('./modules/generateUUID.js'),
    //get files for routes for not loged in
    index = require('./routes/index'),
    download = require('./routes/download'),
    // get files for login
    userAcounts = require('./routes/users/users'),
    //get files for admin
    dashboard = require('./routes/admin/index'),
    displaysAdmin = require('./routes/admin/displays/index'),
    screens = require('./routes/admin/screens/index'),
    slideshows = require('./routes/admin/slideshows/index'),
    display = require('./routes/display/index'),
    users = require('./routes/admin/users/index'),
    api = require('./routes/api/index');

//import libs
require('./lib/hsbHelper.js');

//set vieuw enging
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

//define body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//define static path
app.use(express.static(path.join(__dirname, 'public/dist')));
// app.use(express.static(path.join(__dirname, 'uploads')));

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
    secret: 'soSecureMuchEncryption',
    genid: function(req) {
        return generateUUID() // use UUIDs for session IDs
    },
    store: new FileStore(),
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
    host: '192.168.99.100',
    user: 'root',
    password: 'NietVerteld$jou!!',
    database: 'POSTERS',
    port: 32768
};

// Add connection middleware
app.use(myConnection(mysql, dbOptions, 'single'));


//use routes
app.use('/', index);
app.use('/download', download);
// get files for login
app.use('/users', userAcounts);
//get files for admin
app.use('/admin', dashboard);
app.use('/admin/displays', displaysAdmin);
app.use('/admin/screens', screens);
app.use('/admin/slideshows', slideshows);
app.use('/admin/users', users);
//get files for slidewhows
app.use('/display', display);
app.use('/api', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//start app
io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(3010, function() {
    console.log('listening on localhost:3010');
});
