DP.slideshows = (function() {
    var _plusButton = DP.helper.select('.add'),
        _plusButtonIcon = DP.helper.select('.add svg'),
        _selector = DP.helper.select('.slideshow-picker'),
        _numbers = DP.helper.selectAll('.number'),
        _selectImage = DP.helper.selectAll('.select-image'),
        _addImages = DP.helper.select('.slideshow-picker button');

    var _getIds = function() {
        var _screenlistItemImage = DP.helper.selectAll('.screenitem .image');
        var dataIds = [];
        for (var i = 0; i < _screenlistItemImage.length; i++) {
            dataIds.push(_screenlistItemImage[i].getAttribute('data-id'));
        }
        return dataIds;
    };
    var CreateLi = function(id, filename) {
        return '<li class="screenitem list" draggable="true">' +
            '  <a href="#">' +
            ' <small class="number">' + id + '</small>' +
            '  <div class="image no-overflow" data-id="' + id + '">' +
            '      <img src="/download/' + filename + '" alt="" draggable="false" />' +
            '  </div>' +
            '  </a>' +
            '  </li>';
    };

    var _addNewPoster = function() {
        var _screenlist = DP.helper.select('#screenlist');

        _plusButton.addEventListener('click', function() {
            _toggleAddNewPoster();
        });

        _addImages.addEventListener('click', function() {
            _toggleAddNewPoster();
            for (var i = 0; i < _selectImage.length; i++) {
                if (_selectImage[i].checked) {
                    var id = _selectImage[i].getAttribute('data-id'),
                        filename = _selectImage[i].getAttribute('data-image');

                    _screenlist.innerHTML += CreateLi(id, filename);
                }
            }
            //post data to the server
            DP.helper.postData(DP.routes.currentPath(), 'screens=' + _getIds());
        });
    };

    var _toggleAddNewPoster = function() {
        _selector.classList.toggle('none');
        _plusButtonIcon.classList.toggle('rotate-right');
    };

    var _sortable = function() {
        // inspiration form http://codepen.io/agate1/pen/vOoRvj
        var _screenlist = DP.helper.select('#screenlist'),
            item, ul;

        var screenitems = DP.helper.selectAll('.screenitem');

        _screenlist.addEventListener('dragenter', function(ev) {
            ev.preventDefault();
            if (listNumber(ev.target) > listNumber(item)) {
                ul.insertBefore(ev.target, item);
            } else {
                ul.insertBefore(item, ev.target);
            }
            return true;
        });

        _screenlist.addEventListener('dragend', function() {
            DP.helper.postData(DP.routes.currentPath(), 'screens=' + _getIds());
            item.classList.remove('placeholder');
            return false;
        });
        _screenlist.addEventListener('drop', function functionName(ev) {
            ev.stopPropagation();
            return false;
        });
        _screenlist.addEventListener('dragover', function functionName() {
            return false;
        });

        for (var p = 0; p < screenitems.length; p++) {
            screenitems[p].addEventListener('dragstart', function(ev) {
                item = ev.target;
                ul = ev.target.parentNode;
                ev.dataTransfer.effectAllowed = 'move';
                ev.dataTransfer.setData('Text', item.id);
                item.ondrag = function() {
                    item.classList.add('placeholder');
                };
                recount();
                return true;
            });
        }

        function listNumber(el) {
            for (var i = 0; i < ul.children.length; i++) {
                if (ul.children[i].getAttribute('id') === el.id) {
                    return i;
                }
            }
        }

    };
    var recount = function() {
        for (var n = 0; n < _numbers.length; n++) {
            // console.log(ul.children.querySelectorAll('.number'));
            _numbers[n].innerHTML = n;
        }
    };
    var _edditPoster = function() {
        var _client = new DP.helper.getData(),
            _screenlist = DP.helper.select('#screenlist'),
            _preview = DP.helper.select('.slideshow-preview img'),
            formElements = {
                form: DP.helper.select('.slideshow-screen-settings form'),
                animaion: DP.helper.select('#field-animation'),
                duration: DP.helper.select('#field-duration'),
                startDate: DP.helper.select('#field-date-start'),
                endDate: DP.helper.select('#field-date-end')
            };

        _screenlist.addEventListener('click', function functionName(ev) {
            if (ev.target.tagName === 'IMG') {
                var screenID = ev.target.getAttribute('data-id');

                _client.get('/api/screen/' + screenID, function(response) {
                    var data = JSON.parse(response);
                    console.log(formElements);

                    formElements.form.action = '/admin/screens/edit/' + data.id;
                    formElements.animaion.value = data.animation;
                    formElements.duration.value = data.duration;
                    formElements.startDate.value = data.dateStart;
                    formElements.endDate.value = data.dateEnd;
                });
                _preview.src = ev.target.src;
            }

        });
    };
    var _toggleButtons = function() {
        var toggleButtonsDiv = DP.helper.select('.toggle-buttons');

        toggleButtonsDiv.addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName === 'BUTTON') {
                toggleAll(target, []);
            }
            console.log(target.nodeName);

        });
    };
    var toggleAll = function(target, show) {
        var toggleButtons = DP.helper.selectAll('.toggle-buttons button'),
            tabcontent = DP.helper.selectAll('.tabcontent');
        for (var i = 0; i < toggleButtons.length; i++) {
            if (target === toggleButtons[i] || show[i]) {
                tabcontent[i].classList.remove('none');
                tabcontent[i].setAttribute('aria-hidden', false);
                toggleButtons[i].setAttribute('aria-selected', true);
            } else {
                tabcontent[i].classList.add('none');
                tabcontent[i].setAttribute('aria-hidden', true);
                toggleButtons[i].setAttribute('aria-selected', false);
            }
        }
    };

    var init = function() {
        window.onload = function functionName() {
            toggleAll(false, [true, false, false]);
        };

        _toggleButtons();
        _addNewPoster();
        _sortable();
        _edditPoster();
    };

    return {
        init: init
    };
})();
