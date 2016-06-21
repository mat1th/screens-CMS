DP.slideshows = (function() {
    var _plusButton = DP.helper.select('.add'),
        _plusButtonIcon = DP.helper.select('.add svg'),
        _selector = DP.helper.select('.slideshow-picker'),
        _numbers = DP.helper.selectAll('.number'),
        _selectImage = DP.helper.selectAll('.select-image'),
        _preview = DP.helper.select('.slideshow-preview img'),
        _addImages = DP.helper.select('.slideshow-picker button');

    var _getIds = function() {
        var _contentlistItemImage = DP.helper.selectAll('.contentitem .image');
        var dataIds = [];
        for (var i = 0; i < _contentlistItemImage.length; i++) {
            dataIds.push(_contentlistItemImage[i].getAttribute('data-id'));
        }
        return dataIds;
    };
    var CreateLi = function(id, filename) { //return a li item with the nessesery structure
        return '<li class="contentitem list" draggable="true">' +
            '<a href="#">' +
            '<span class="number">' + id + '</span>' +
            '<div class="image no-overflow" data-id="' + id + '">' +
            '<img src="/download/' + filename + '" alt="content" draggable="false" data-id="' + id + '">' +
            '</div>' +
            '</a>' +
            '</li>';
    };

    var _addNewPoster = function() { //ad a new poster dropdown
        var _contentlist = DP.helper.select('#contentlist');

        _plusButton.addEventListener('click', function() {
            _toggleAddNewPoster();
        });

        _addImages.addEventListener('click', function() {
            _toggleAddNewPoster();
            for (var i = 0; i < _selectImage.length; i++) {
                if (_selectImage[i].checked) {
                    var id = _selectImage[i].getAttribute('data-id'),
                        filename = _selectImage[i].getAttribute('data-image');

                    _contentlist.innerHTML += CreateLi(id, filename); // add a new li to the content html
                }
            }
            //post data to the server
            DP.helper.postData(DP.routes.currentPath(), 'content=' + _getIds()); //send the post request to the server to save the new poster in the slideshow
        });
    };

    var _toggleAddNewPoster = function() { //toggle the plus button and content picker
        _selector.classList.toggle('disabled');
        _plusButtonIcon.classList.toggle('rotate-right');
    };

    var _sortable = function() { //make the content shortable
        // inspiration form http://codepen.io/agate1/pen/vOoRvj
        var _contentlist = DP.helper.select('#contentlist'),
            item, ul;

        var contentitems = DP.helper.selectAll('.contentitem');

        _contentlist.addEventListener('dragenter', function(ev) { //lissen to changes in the ol
            if (listNumber(ev.target) > listNumber(item)) { //if the number of the item is bigger than isert before
                ul.insertBefore(ev.target, item);
            } else {
                ul.insertBefore(item, ev.target);
            }
            ev.preventDefault();
            return true;
        });

        _contentlist.addEventListener('dragend', function() { //if a is dragged post the new order to the server
            DP.helper.postData(DP.routes.currentPath(), 'content=' + _getIds());

            DP.helper.removeClass(item, 'placeholder'); //remove the placeholder

            return false;
        });
        _contentlist.addEventListener('drop', function functionName(ev) { //if the elemnent is dropped stop the preview of the elemnent in the list
            ev.stopPropagation();
            return false;
        });
        _contentlist.addEventListener('dragover', function functionName() {
            return false;
        });

        for (var p = 0; p < contentitems.length; p++) { // add a event to each li item
            contentitems[p].addEventListener('dragstart', function(ev) {
                item = ev.target;
                ul = ev.target.parentNode;
                ev.dataTransfer.effectAllowed = 'move';
                ev.dataTransfer.setData('Text', item.id);
                item.ondrag = function() {
                    DP.helper.addClass(item, 'placeholder');
                };
                recount();
                return true;
            });
        }

        function listNumber(el) { // get the list number of the item
            for (var i = 0; i < ul.children.length; i++) {
                if (ul.children[i].getAttribute('id') === el.id) {
                    return i;
                }
            }
        }

    };
    var recount = function() { //recoun the list
        for (var n = 0; n < _numbers.length; n++) {
            // console.log(ul.children.querySelectorAll('.number'));
            _numbers[n].innerHTML = n;
        }
    };
    var _edditPoster = function() { //set the values in the form so the user doesn't have to fill it by hissef
        var _client = new DP.helper.getData(),
            _contentlist = DP.helper.select('#contentlist'),
            formElements = {
                form: DP.helper.select('.slideshow-content-settings form'),
                animaion: DP.helper.select('#field-animation'),
                duration: DP.helper.select('#field-duration'),
                startDate: DP.helper.select('#field-date-start'),
                color: DP.helper.select('#field-color'),
                endDate: DP.helper.select('#field-date-end')
            };

        _contentlist.addEventListener('click', function functionName(ev) {
            if (ev.target.tagName === 'IMG') { // if the target is a image
                var contentID = ev.target.getAttribute('data-id');

                _client.get('/api/content/' + contentID, function(response) { //get the data from the api
                    var data = JSON.parse(response);
                    formElements.form.action = '/admin/content/edit/' + data.id;
                    formElements.animaion.value = data.animation;
                    formElements.duration.value = data.duration;
                    formElements.startDate.value = data.dateStart;
                    formElements.color.value = data.color;
                    formElements.endDate.value = data.dateEnd;
                });
                _preview.src = ev.target.src;
            }
        });
    };
    var _toggleButtons = function() { //show or hide the tap on the right menu
        var toggleButtonsDiv = DP.helper.select('.toggle-buttons');

        toggleButtonsDiv.addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName === 'BUTTON') {
                toggleAll(target, []);
            }
        });
    };
    var toggleAll = function(target, show) { // togglle all the itemns
        var toggleButtons = DP.helper.selectAll('.toggle-buttons button'),
            tabcontent = DP.helper.selectAll('.tabcontent');
        for (var i = 0; i < toggleButtons.length; i++) {
            if (target === toggleButtons[i] || show[i]) {
                DP.helper.removeClass(tabcontent[i], 'disabled');
                tabcontent[i].setAttribute('aria-hidden', false);
                toggleButtons[i].setAttribute('aria-selected', true);
            } else {
                DP.helper.addClass(tabcontent[i], 'disabled');
                tabcontent[i].setAttribute('aria-hidden', true);
                toggleButtons[i].setAttribute('aria-selected', false);
            }
        }
    };
    var animateSelect = function() { // add a anumtion to the poster if a user selects a animaion
        var select = DP.helper.selectId('field-animation');
        var animations = ['fadein', 'left-push', 'top-push'];

        select.addEventListener('change', function(e) {
            for (var i = 0; i < animations.length; i++) {
                DP.helper.removeClass(_preview, animations[i]);
                console.log(_preview.classList);
            }
            DP.helper.addClass(_preview, e.target.value);
        });
    };

    var init = function() {
        window.onload = function functionName() { // on window load enable the first tab
            toggleAll(false, [true, false, false]);
        };

        _toggleButtons();
        _addNewPoster();
        _sortable();
        _edditPoster();
        animateSelect();
    };

    return {
        init: init
    };
})();
