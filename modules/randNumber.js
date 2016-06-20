var randNumber = function(max) { //create a random number the input is the max muber 
    var number = Math.random();
    return Math.floor(number  * (max - 0) + 0);
};

module.exports = randNumber;
