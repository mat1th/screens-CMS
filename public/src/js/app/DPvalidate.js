DP.validate = (function() {
    var _email = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    var _color = function(color) {
        var re = /^#[0-9a-f]{3}([0-9a-f]{3})?$/;
        return re.test(color);
    };
    var _number = function(number) {
        return isNaN(number);
    };
    var _date = function(date) {
        var re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
        return re.test(date);
    };

    var form = function() {
        var form = DP.helper.select('form');
        form.addEventListener('input', function(e) {
            if (e.target.value.length === 0) {
                e.target.classList.add('error');
            } else {
                e.target.classList.remove('error');
            }
        });
    };
    var setErrorDate = function(elm, elmErr, err) {
        elm.addEventListener('blur', function(e) {
            if (!_date(e.target.value)) {
                elm.classList.add('error');
                elmErr.innerHTML = err;
            } else {
                elm.classList.remove('error');
                elmErr.innerHTML = '';
            }
        });
    };
    var setErrorColor = function(elm, elmErr, err) {
        elm.addEventListener('blur', function(e) {
            if (!_color(e.target.value)) {
                elm.classList.add('error');
                elmErr.innerHTML = err;
            } else {
                elm.classList.remove('error');
                elmErr.innerHTML = '';
            }
        });
    };
    var setErrorEmail = function(elm, elmErr, err) {
        elm.addEventListener('blur', function(e) {
            if (!_email(e.target.value)) {
                elm.classList.add('error');
                elmErr.innerHTML = err;
            } else {
                elm.classList.remove('error');
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
