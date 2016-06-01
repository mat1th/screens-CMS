var getData = function(sqlQuery, sqlValues, connection) {
    return new Promise(function(resolve, reject) {
        try {
            connection.query(sqlQuery, sqlValues, function(err) {
                if (err) return reject(err);
                resolve();

            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = getData;
