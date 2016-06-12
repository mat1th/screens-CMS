DP.serviceWorker = (function() {
    function init() {
        // in page.html
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                })
                .then(reg => console.info('registered sw', reg))
                .catch(err => console.error('error registering sw', err));
        } else {
            console.log('ServiceWorker is not supported');
        }
    }

    return {
        init: init
    }
})();
