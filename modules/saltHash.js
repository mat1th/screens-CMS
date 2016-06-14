var crypto = require('crypto');

var saltHash = (function() {
    var genRandomString = function(length) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    };

    var sha512 = function(password, salt) {
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        var value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    };


    var saltHashPassword = function(userPassword) {
        var salt = genRandomString(16);
        var passwordData = sha512(userPassword, salt);

        return {
            hash: passwordData.passwordHash,
            salt: passwordData.salt
        };
    }
    var check = function(salt, hash, password) {
        var passwordData = sha512(password, salt);
        if (passwordData.passwordHash === hash) {
            return true;
        } else {
            return false;
        }
    }
    return {
        get: saltHashPassword,
        check: check
    };
}());


module.exports = saltHash;
