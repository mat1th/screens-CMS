DP.routes = (function() {
    var currentPath = function() { //get the current path
        return window.location.pathname;
    };
    var pathname = function(path) { //check the
        return currentPath() === path;
    };
    var splitUrl = function(path) { //get the path exept the Id
        return currentPath().split('/', 4).join('/') === path;
    };

    var _checkRoutes = function() { //check the paths
        if (window.location) {
            if (pathname('/admin/content/add')) {
                DP.content.init(); //run the js part for the content page
            } else if (pathname('/users/login') || pathname('/users/register')) {
                DP.users.init();
            } else if (splitUrl('/admin/slideshows/add')) {
                DP.slideshows.init();
            } else if (splitUrl('/admin/users/edit')) {
                DP.users.email();
            }
        } else {
          // if the window.location function is not supported run all funcitons
            DP.content.init();
            DP.users.init();
            DP.slideshows.init();
            DP.users.email();
        }
    };
    var init = function() { //start the functions
        _checkRoutes();
    };

    return {
        init: init,
        currentPath: currentPath
    };
})();
