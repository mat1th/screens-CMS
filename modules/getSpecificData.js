var getSpecificData = function(sqlQuery, connection, data) {
    return new Promise(function(resolve, reject) {
        try {
            connection.query(sqlQuery, data, function(err, rows) {
                if (err) return reject(err);

                if (rows !== '') {
                    resolve(rows);
                } else {
                    reject('is string');
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = getSpecificData;
