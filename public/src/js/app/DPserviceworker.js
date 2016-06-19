DP.serviceWorker = (function() {
    function init() {
        // in page.html
        if ('serviceWorker' in navigator) { //check if the service worker is supported in the browser
            navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                })
                .then(reg => console.info('registered sw', reg)) 
                .catch(err => console.error('error registering sw', err));
        } else {
            console.log('ServiceWorker is not supported'); //log if it's not supported
        }
    }

    return {
        init: init
    }
})();
