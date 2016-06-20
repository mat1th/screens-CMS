var crypto = require('crypto');

var saltHash = (function() { //enqriptin a password
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
    /**
     *  Generate a hash from a password
     * @param   {string}  the password string
     * @returns {Object}  a hash and a string to save in the databe
     */
    var saltHashPassword = function(userPassword) {
        var salt = genRandomString(16);
        var passwordData = sha512(userPassword, salt);

        return {
            hash: passwordData.passwordHash,
            salt: passwordData.salt
        };
    };

    /**
     *  checks if the two hashes are the same
     * @param   {string, string, string}    the salt to enqript the password, the hash from the databse and the filled in password
     * @returns {Object} true of false 
     */
    var check = function(salt, hash, password) {
        var passwordData = sha512(password, salt);
        if (passwordData.passwordHash === hash) {
            return true;
        } else {
            return false;
        }
    };
    return {
        get: saltHashPassword,
        check: check
    };
}());


module.exports = saltHash;
