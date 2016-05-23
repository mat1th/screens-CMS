(function() {
    var $ = function(selector) {
            return document.querySelector(selector);
        },
        $$ = function(selector) {
            return document.querySelectorAll(selector);
        };

    function scroll() {

    }
    window.onload = function(event) {
        scroll();
    };
})();
