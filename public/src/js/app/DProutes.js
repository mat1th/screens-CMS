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
        if (window.location) {
            if (pathname('/admin/screens/add')) {
                DP.screens.init();
            } else if (pathname('/users/login') || pathname('/users/register')) {
                DP.users.init();
            } else if (splitUrl('/admin/slideshows/add')) {
                DP.slideshows.init();
            } else if (splitUrl('/admin/users/edit')) {
                DP.users.email();
            }
        } else {
            DP.screens.init();
            DP.users.init();
            DP.slideshows.init();
            DP.users.email();
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
