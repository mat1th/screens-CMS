DP.helper = (function() {
    /**
     * Selects the element. and if querySelector is not defined it will return false.
     * @param   {Object}    the id or class from the html node you would like to get
     * @returns {Object}    A nodeList object from the HTML element.
     */
    var select = function(selector) {
            if (document.querySelector) {
                return document.querySelector(selector);
            } else {
                return false;
            }
        },
        /**
         * Selects the element with the id you have defined.
         * @param   {Object}    the id or class from the html node you would like to get
         * @returns {Object}    A nodeList object from the HTML element.
         */
        selectId = function(selector) {
            return document.getElementById(selector);
        },
        /**
         * Selects  the  all the elements. with the class and if querySelectorAll is not defined it will return false.
         * @param   {Object}    the class from the html node you would like to get
         * @returns {Object}    A nodeList object from the HTML element.
         */
        selectAll = function(selector) {
            if (document.querySelector) {
                return document.querySelectorAll(selector);
            } else {
                return false;
            }
        },
        /**
         * Creates a get XMLHttpRequest you can use it by   var _client = new DP.helper.GetData(),   _client.get('url', function(response) {})
         * @param   {String, String}    The url form the page you would like to get
         * @returns {Object}    The page content you would lik to get.
         */
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
        /**
         * Creates a POST XMLHttpRequest you can use it by    DP.helper.postData('path', 'params');
         * @param   {String, String}    The url op the page you would lik to post to, and the params you want to post
         * @returns {Object}            it will retun a error if somthing is wrong.
         */
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
        /**
         * Shows and hides the loader
         * @param   {Bool}   If you give true the loader wil display, by false the loader will disapear
         */
        loader = function(status) {
            var loader = selectId('loader');
            var time = 5000;
            if (status === true) {
                loader.classList.remove('disabled');
            } else if (status === false) {
                setTimeout(function() {
                    loader.classList.add('disabled');
                }, time);
            }
        },
        /**
         * Shows and hides the error message
         * @param   {Bool, String}   If you give true the loader wil display, by false the loader will disapear. The string is the content of the error
         */
        showErr = function(show, errorMessage) {
            var errorPopup = selectId('error-popup');
            var errorPopupContent = selectId('error-popup-content');
            if (show) {
                errorPopupContent.innerHTML = errorMessage;
                errorPopup.classList.remove('disabled');
                errorPopup.classList.add('top-push');
            } else {
                errorPopup.classList.add('disabled');
                errorPopup.classList.remove('top-push');
            }

        };
    return {
        select: select,
        selectId: selectId,
        selectAll: selectAll,
        getData: GetData,
        postData: postData,
        loader: loader,
        showErr: showErr
    };
})();
