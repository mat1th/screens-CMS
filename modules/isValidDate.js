var moment = require('moment');

var isValidDate = function(date) {
    if (moment('12-12-2012', 'MM-DD-YYYY').isValid()) {
        return true;
    } else if (moment('2012-12-12', 'YYYY-MM-DD').isValid()) {
        return true;
    } else if (moment('12-12-2012', 'DD-MM-YYYY').isValid()) {
        return true;
    } else if (moment('12-12-2012', 'DD-MM-YYYY').isValid()) {
        return true;
    } else {
        return false;
    }
};

module.exports = isValidDate;
