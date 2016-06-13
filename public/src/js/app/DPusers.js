DP.users = (function() {
    var init = function() {
        email();
    };
    var email = function() {
        var emailField = DP.helper.selectId('field_email'),
            emailErr = DP.helper.select('#email-error');

        DP.validate.form();

        emailField.addEventListener('blur', function(e) {
            if (!DP.validate.email(e.target.value)) {
                emailField.classList.add('error');
                emailErr.innerHTML = 'Your email is not valid';
            } else {
                emailField.classList.remove('error');
                emailErr.innerHTML = '';
            }
        });
    };

    return {
        init: init,
        email: email
    };
})();
