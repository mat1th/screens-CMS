DP.support = (function() {
    var init = function() {
        onlineStatus();
    };
    var onlineStatus = function() { // check the online status and show a erro if the user is offlie
        window.addEventListener('online', function() {
            showErr(false);
        });
        window.addEventListener('offline', function() {
            showErr(true);
        });
        window.ononline = function() {
            showErr(false);
        };
        window.onoffline = function() {
            showErr(true);
        };

        function showErr(show) {
            if (show) {
                DP.helper.showErr(true, 'The app is offline, please go online.');
            } else {
                DP.helper.showErr(false);
            }
        }
    };
    return {
        init: init
    };
})();
