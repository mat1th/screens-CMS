DP.support = (function() {
    var init = function() {
        onlineStatus();
    };
    var onlineStatus = function() {
        addEvent(window, 'online', function() {
            showErr(false);
        });

        addEvent(window, 'offline', function() {
            showErr(true);
        });

        window.ononline = function() {
            showErr(false);
        };

        window.onoffline = function() {
            showErr(true);
        };

        document.body.onOnline = showErr(false);
        document.body.onOffline = showErr(true);

        function showErr(show) {
            if (show) {
                DP.helper.showErr(true, 'The app is offline, please go online.')
            } else {
                DP.helper.showErr(false);
            }
        }
    };
    return {
        init: init
    };
})();
