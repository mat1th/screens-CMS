DP.helper = (function() {
    var select = function(selector) {
            return document.querySelector(selector);
        },
        selectAll = function(selector) {
            return document.querySelectorAll(selector);
        };

    return {
        select: select,
        selectAll: selectAll
    }
})();
