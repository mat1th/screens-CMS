DP.users = (function() {
    var init = function() {
        email();
    };
    var email = function() { //validate the email on the sigin in and sign up page 
        var emailField = DP.helper.selectId('field_email'),
            emailErr = DP.helper.select('#email-error');

        DP.validate.form();
        DP.validate.setErrorEmail(emailField, emailErr, 'Your email is not valid');
    };

    return {
        init: init,
        email: email
    };
})();
