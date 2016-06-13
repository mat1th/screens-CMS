DP.validate = (function() {
    var email = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    var color = function(color) {
        var re = /^#[0-9a-f]{3}([0-9a-f]{3})?$/;
        return re.test(color);
    };
    var number = function(number) {
        return isNaN(number);
    };
    return {
        email: email,
        color: color,
        number: number
    };
})();
