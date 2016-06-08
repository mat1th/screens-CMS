DP.start = (function() {
    var init = function() {
        DP.routes.init();
        DP.support.init();
    };
    return {
        init: init
    };
})();

DP.start.init();
