DP.start = (function() {
    //run all the funcitons for starting the app
    var init = function() {
        DP.routes.init(); // checks on witch page the vissitor is.
        DP.support.init();  //checks support
        DP.serviceWorker.init(); //starts service worker
    };
    return {
        init: init
    };
})();

DP.start.init();
