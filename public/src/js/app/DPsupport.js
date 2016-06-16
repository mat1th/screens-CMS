DP.support = (function() {
    var init = function() {
        onlineStatus();
    };
    var onlineStatus = function() {
        window.addEventListener('online', function() {
          console.log('1');
            showErr(false);
        });
        window.addEventListener('offline', function() {
                    console.log('2');
            showErr(true);
        });
        window.ononline = function() {
                    console.log('3');
            showErr(false);
        };
        window.onoffline = function() {
                    console.log('4');
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
