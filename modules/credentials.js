var credentials = function(session) {
    return {
        login: (session.user_id) ? true : false,
        user_id: session.user_id,
        admin: (session.role === 'admin') ? true : false,
        editor: (session.role === 'editor' || session.role === 'admin') ? true : false
    };
};

module.exports = credentials;
