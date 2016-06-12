DP.start = (function() {
    var init = function() {
        DP.routes.init();
        DP.support.init();
        DP.support.init();
        DP.serviceWorker.init();
    };
    return {
        init: init
    };
})();

DP.start.init();
