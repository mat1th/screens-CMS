DP.routes = (function() {
    var pathname = function(path) {
        return window.location.pathname === path;
    }

    var _checkRoutes = function() {
        if (pathname('/admin/posters/add')) {
            DP.poster.uploadPreview();
        }
    }
    var init = function() {
        _checkRoutes();
    }

    return {
        init: init
    }
})();
