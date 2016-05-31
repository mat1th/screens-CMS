var randNumber = function() {
    var number = Math.random();
    return Math.floor(number  * (1000000000 - 0) + 0);
}

module.exports = randNumber;
