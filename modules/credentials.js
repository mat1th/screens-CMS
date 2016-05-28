var credentials = function(session) {
    return {
        login: (session.email) ? true : false,
        email: session.email,
        admin: (session.role === 'admin') ? true : false
    };
};

module.exports = credentials;