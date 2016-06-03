var email = require('emailjs');

var sendMessage = function(person) {
    var server = email.server.connect({
        user: 'email@someone.com',
        password: 'password',
        host: 'spmtp-server.com',
        tls: {
            ciphers: 'SSLv3'
        }
    });

    var message = {
        text: 'i hope this works',
        from: 'you <username@outlook.com>',
        to: 'someone <matthias@dolstra.me',
        subject: 'testing emailjs',
        attachment: [{
            data: '<html>i <i>hope</i> this works!</html>',
            alternative: true
        }]
    };
    server.send(message, function(err, message) {
        console.log(err || message);
    });
};

module.exports = sendMessage;
