DP.slideshows = (function() {
    var _plusButton = DP.helper.select('.add'),
        _plusButtonIcon = DP.helper.select('.add svg'),
        _selector = DP.helper.select('.slideshow-picker'),
        _numbers = DP.helper.selectAll('.number'),
        _selectImage = DP.helper.selectAll('.select-image'),
        _addImages = DP.helper.select('.slideshow-picker button');

    var _getIds = function() {
        var _posterlistItemImage = DP.helper.selectAll('.posteritem .image');
        var dataIds = [];
        for (var i = 0; i < _posterlistItemImage.length; i++) {
            dataIds.push(_posterlistItemImage[i].getAttribute('data-id'));
        }
        return dataIds;
    };

    var _addNewPoster = function() {
        var _posterlist = DP.helper.select('#posterlist');

        _plusButton.addEventListener('click', function() {
            _toggleAddNewPoster();
        });

        _addImages.addEventListener('click', function() {
            _toggleAddNewPoster();
            var liElement = function(id, filename) {
                return '<li class="posteritem list" draggable="true">' +
                    '  <a href="#">' +
                    ' <small class="number">5</small>' +
                    '  <div class="image no-overflow" data-id="' + id + '">' +
                    '      <img src="/download/' + filename + '" alt="" draggable="false" />' +
                    '  </div>' +
                    '  </a>' +
                    '  </li>';
            };

            for (var i = 0; i < _selectImage.length; i++) {

                if (_selectImage[i].checked) {
                    var id = _selectImage[i].getAttribute('data-id'),
                        filename = _selectImage[i].getAttribute('data-image');
                    // document.body.appendChild();
                    _posterlist.innerHTML += liElement(id, filename);
                }
            }

            DP.helper.postData(DP.routes.currentPath(), 'posters=' + _getIds());
        });
    };
    var _toggleAddNewPoster = function() {
        _selector.classList.toggle('none');
        _plusButtonIcon.classList.toggle('rotate-right');
    };
    var _sortable = function() {
        // inspiration form http://codepen.io/agate1/pen/vOoRvj
        var _posterlist = DP.helper.select('#posterlist'),
            item, ul;

        var posteritems = DP.helper.selectAll('.posteritem');

        _posterlist.addEventListener('dragenter', function(ev) {
            ev.preventDefault();
            if (listNumber(ev.target) > listNumber(item)) {
                ul.insertBefore(ev.target, item);
            } else {
                ul.insertBefore(item, ev.target);
            }
            return true;
        });

        _posterlist.addEventListener('dragend', function() {

            item.classList.remove('placeholder');

            return false;
        });
        _posterlist.addEventListener('drop', function functionName(ev) {
            ev.stopPropagation();
            return false;
        });
        _posterlist.addEventListener('dragover', function functionName() {
            return false;
        });

        for (var p = 0; p < posteritems.length; p++) {
            posteritems[p].addEventListener('dragstart', function(ev) {
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
        var recount = function() {
            for (var n = 0; n < _numbers.length; n++) {
                // console.log(ul.children.querySelectorAll('.number'));
                _numbers[n].innerHTML = n;
            }
        };
    };

    var init = function() {
        _addNewPoster();
        _sortable();
    };


    return {
        init: init
    };
})();
