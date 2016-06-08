DP.support = (function() {
    var init = function() {
        onlineStatus();
    };
    var onlineStatus = function() {
        window.addEventListener('offline', function(e) {
            console.log('offline');
        });

        window.addEventListener('online', function(e) {
            console.log('online');
        });
    };
    return {
        init: init
    };
})();
