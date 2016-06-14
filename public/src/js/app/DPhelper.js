DP.helper = (function() {
    var select = function(selector) {
            if (document.querySelector) {
                return document.querySelector(selector);
            } else {
                return false;
            }
        },
        selectId = function(selector) {
            return document.getElementById(selector);
        },
        selectAll = function(selector) {
            if (document.querySelector) {
                return document.querySelectorAll(selector);
            } else {
                return false;
            }
        },
        GetData = function() { //Source https://stackoverflow.com/questions/247483/http-get-request-in-javascript
            if (window.XMLHttpRequest) {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    loader(true);
                    anHttpRequest.onreadystatechange = function() {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
                            aCallback(anHttpRequest.responseText);
                        } else if (anHttpRequest.status == 404) {
                            aCallback('error');
                        }
                    };
                    anHttpRequest.open('GET', aUrl, true);
                    anHttpRequest.send(null);
                    loader(false);
                };
            } else {
                console.log('XMLHttpRequest is not supported');
                return false;
            }
        },
        postData = function(url, params) {
            if (window.XMLHttpRequest) {
                var http = new XMLHttpRequest();
                loader(true);
                http.open('POST', url, true);

                //Send the proper header information along with the request
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                http.onreadystatechange = function() { //Call a function when the state changes.

                    if (http.readyState == 4 && http.status == 200) {
                        console.log(http.responseText);
                    }
                };
                http.send(params);
                loader(false);
            } else {
                console.log('XMLHttpRequest is not supported');
                return false;
            }
        },
        loader = function(status) {
            var loader = selectId('loader');
            var time = 5000;
            if (status === true) {
                loader.classList.remove('none');
            } else if (status === false) {
                setTimeout(function() {
                    loader.classList.add('none');
                }, time);
            }
        };
    return {
        select: select,
        selectId: selectId,
        selectAll: selectAll,
        getData: GetData,
        postData: postData,
        loader: loader
    };
})();
