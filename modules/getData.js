var getData = function(sqlQuery, connection) { //cerate from a connection a prommise 
    return new Promise(function(resolve, reject) {
        try {
            connection.query(sqlQuery, function(err, rows) {
                if (err) return reject(err);
                if (rows !== '') {
                    resolve(rows);
                }else {
                  reject('is string');
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = getData;
