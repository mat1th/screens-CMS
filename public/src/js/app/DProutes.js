DP.routes = (function() {
    var pathname = function(path) {
        return window.location.pathname === path;
    };

    var _checkRoutes = function() {
        if (pathname('/admin/posters/add')) {
            DP.poster.uploadPreview();
        } else if (pathname('/admin/slideshows/add')) {
            DP.slideshows.init();
        }
    };
    var init = function() {
        _checkRoutes();
    };

    return {
        init: init
    };
})();
