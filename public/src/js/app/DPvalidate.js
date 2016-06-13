DP.validate = (function() {

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
        form: form,
        email: email,
        color: color,
        number: number
    };
})();
