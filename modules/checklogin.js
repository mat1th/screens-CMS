var checklogin = function(session) {
    if (session.user_id) {

        return true;
    } else {
        return false;
    }
};

module.exports = checklogin;
