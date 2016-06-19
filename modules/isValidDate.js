var moment = require('moment');

var isValidDate = function(date) { //checks if it is a vallid date 
    if (moment(date, 'MM-DD-YYYY').isValid()) {
        return true;
    } else if (moment(date, 'YYYY-MM-DD').isValid()) {
        return true;
    } else if (moment(date, 'DD-MM-YYYY').isValid()) {
        return true;
    } else if (moment(date, 'DD-MM-YYYY').isValid()) {
        return true;
    } else if (moment(date, 'DD-MM-YYYY').isValid()) {
        return true;
    } else if (moment(date, 'DD-MM-YY').isValid()) {
        return true;
    } else {
        return false;
    }
};

module.exports = isValidDate;
