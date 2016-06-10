global.io;

function socketConnection(http) {
    global.io = require('socket.io')(http);
    console.log('socket setup');
    setListners();
}

function setListners() {
    global.io.on('connection', function(socket) {
        console.log('conected');
        // If addScore event is fired log data on server
        socket.on('display reload', function(data) {
              console.log('display reload started');
        });
    });
}

module.exports = socketConnection;
