DP.routes = (function() {
    var currentPath = function() {
        return window.location.pathname;
    };
    var pathname = function(path) {
        return window.location.pathname === path;
    };
    var splitUrl = function(path) {
        return window.location.pathname.split('/', 4).join('/') === path;
    };

    var _checkRoutes = function() {

        if (pathname('/admin/screens/add')) {
            DP.screens.init();
        } else if (splitUrl('/admin/slideshows/add')) {
            DP.slideshows.init();
        } else {
            // DP.slideshows.init();
        }
    };
    var init = function() {
        _checkRoutes();
    };

    return {
        init: init,
        currentPath: currentPath
    };
})();
