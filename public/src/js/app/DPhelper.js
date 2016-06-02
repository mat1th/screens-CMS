DP.helper = (function() {
    var select = function(selector) {
            return document.querySelector(selector);
        },
        selectId = function(selector) {
            return document.getElementById(selector);
        },
        selectAll = function(selector) {
            return document.querySelectorAll(selector);
        },
        GetData = function() { //Source https://stackoverflow.com/questions/247483/http-get-request-in-javascript
            if (window.XMLHttpRequest) {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();

                    anHttpRequest.onreadystatechange = function() {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
                            aCallback(anHttpRequest.responseText);
                        } else if (anHttpRequest.status == 404) {
                            aCallback('error');
                        }
                    };
                    anHttpRequest.open('GET', aUrl, true);
                    anHttpRequest.send(null);
                };
            } else {
                return false;
            }
        },
        postData = function(url, params) {
            var http = new XMLHttpRequest();
            http.open('POST', url, true);

            //Send the proper header information along with the request
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            http.onreadystatechange = function() { //Call a function when the state changes.

                if (http.readyState == 4 && http.status == 200) {
                    console.log(http.responseText);
                }
            };
            http.send(params);
        };

    return {
        select: select,
        selectId: selectId,
        selectAll: selectAll,
        getData: GetData,
        postData: postData
    };
})();
