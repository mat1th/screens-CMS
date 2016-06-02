var getData = function(sqlQuery, sqlValues, connection) {
    return new Promise(function(resolve, reject) {
        try {
            connection.query(sqlQuery, sqlValues, function(err, row) {
                if (err) return reject(err);
                console.log(row);
                resolve();

            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = getData;
