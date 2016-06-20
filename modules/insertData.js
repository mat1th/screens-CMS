var inserData = function(sqlQuery, sqlValues, connection) { //create from inserting data prommise
    return new Promise(function(resolve, reject) {
        try {
            connection.query(sqlQuery, sqlValues, function(err, row) {
                if (err) return reject(err);
                // console.log(row);
                resolve(row);

            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = inserData;
