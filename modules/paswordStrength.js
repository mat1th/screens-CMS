var paswordStrength = function(pwd) { //ceh
    var pwd = pwd;
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{6,}).*", "g");

    if (pwd.length == 0) {
        return 'Type Password';
    } else if (false == enoughRegex.test(pwd)) {
        return 'Please use more than 8 Characters';
    } else if (strongRegex.test(pwd)) {
        return ' < span style = "color:green" > Strong! < /span>';
    } else if (mediumRegex.test(pwd)) {
        return ' < span style = "color:orange" > Medium! < /span>';
    } else {
        return ' < span style = "color:red" > Weak! < /span>';
    }
}

module.exports = paswordStrength;
