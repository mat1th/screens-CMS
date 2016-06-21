DP.validate = (function() {
    var _email = function(email) { //validate string for a email
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    var _color = function(color) { //validate string for a collor
        var re = /^#[0-9a-f]{3}([0-9a-f]{3})?$/;
        return re.test(color);
    };
    var _number = function(number) { //validate a number
        return isNaN(number);
    };
    //validate string for a date
    var _date = function(date) {
        var re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
        return re.test(date);
    };

    var form = function() { //add a red error collor if a input field is empty
        var form = DP.helper.select('form');
        form.addEventListener('input', function(e) {
            if (e.target.value.length === 0) {
                DP.helper.addClass(e.target, 'error');
            } else {
                DP.helper.removeClass(e.target, 'error');
            }
        });
    };
    var setErrorDate = function(elm, elmErr, err) { // set a error if the date is falsein the form
        elm.addEventListener('blur', function(e) {
            if (!_date(e.target.value)) {
                DP.helper.addClass(elm, 'error');
                elmErr.innerHTML = err;
            } else {
                DP.helper.removeClass(elm, 'error');
                elmErr.innerHTML = '';
            }
        });
    };
    var setErrorColor = function(elm, elmErr, err) { // set a error is the color is false in the form
        elm.addEventListener('blur', function(e) {
            if (!_color(e.target.value)) {
                DP.helper.addClass(elm, 'error');
                elmErr.innerHTML = err;
            } else {
                DP.helper.removeClass(elm, 'error');
                elmErr.innerHTML = '';
            }
        });
    };
    var setErrorEmail = function(elm, elmErr, err) { //set a erro if the email is false in the form
        elm.addEventListener('blur', function(e) {
            if (!_email(e.target.value)) {
                DP.helper.addClass(elm, 'error');
                elmErr.innerHTML = err;
            } else {
                DP.helper.removeClass(elm, 'error');
                elmErr.innerHTML = '';
            }
        });
    };

    return {
        form: form,
        setErrorDate: setErrorDate,
        setErrorColor: setErrorColor,
        setErrorEmail: setErrorEmail
    };
})();
