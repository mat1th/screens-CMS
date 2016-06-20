var credentials = function(session) {
    return { //set the credentials so a route knows how to handle them
        login: (session.user_id) ? true : false,
        user_id: session.user_id,
        admin: (session.role === 'admin') ? true : false,
        editor: (session.role === 'editor' || session.role === 'admin') ? true : false
    };
};

module.exports = credentials;
