var email = require('emailjs');

var sendMessage = function(message) {
    var server = email.server.connect({
        user: 'email',
        password: 'password',
        host: 'mail server',
        tls: {
            ciphers: 'SSLv3'
        }
    });

    server.send(message, function(err, message) {
        console.log('mail send');
        console.log(err || message);
    });
};


module.exports = sendMessage;
