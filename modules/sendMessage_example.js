//remane this file to sendMessage.js
var email = require('emailjs');

var sendMessage = function(message) {
    var server = email.server.connect({
        user: 'useer@email.nl', //fill in your own email or user acount
        password: 'wachtwoord', //you own password
        host: 'sserver', // the email server SMTP
        tls: {
            ciphers: 'SSLv3'
        }
    });

    server.send(message, function(err, message) { //sends the message 
        console.log('mail send');
        console.log(err || message);
    });
};


module.exports = sendMessage;
