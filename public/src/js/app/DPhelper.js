DP.helper = (function() {
    var select = function(selector) {
            return document.querySelector(selector);
        },
        selectAll = function(selector) {
            return document.querySelectorAll(selector);
        },
        getData = function() { //Source https://stackoverflow.com/questions/247483/http-get-request-in-javascript
            if (window.XMLHttpRequest) {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();

                    anHttpRequest.onreadystatechange = function() {
                        if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200) {
                            aCallback(anHttpRequest.responseText);
                        }
                    };
                    anHttpRequest.open('GET', aUrl, true);
                    anHttpRequest.send(null);
                };
            } else {
                return false;
            }
        };

    return {
        select: select,
        selectAll: selectAll,
        getData: getData
    };
})();
