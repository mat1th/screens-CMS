DP.slideshows = (function() {
    var _plusButton = DP.helper.select('.add'),
        _plusButtonIcon = DP.helper.select('.add svg'),
        _selector = DP.helper.select('.slideshow-picker'),
        _posterlist = DP.helper.select('#posterlist'),
        _numbers = DP.helper.selectAll('.number'),
        _selectImage = DP.helper.selectAll('.select-image'),
        _addImages = DP.helper.select('.slideshow-picker button');


    var _addNewPoster = function() {
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

            var list = _posterlist;
            for (var i = 0; i < _selectImage.length; i++) {

                if (_selectImage[i].checked) {
                    var id = _selectImage[i].getAttribute('data-id'),
                        filename = _selectImage[i].getAttribute('data-image');
                        console.log(_posterlist);
                        // document.body.appendChild();
                    _posterlist.innerHTML += liElement(id, filename);
                }
            }
        });
    };
    var _toggleAddNewPoster = function() {
        _selector.classList.toggle('none');
        _plusButtonIcon.classList.toggle('rotate-right');
    };
    var _sortable = function() {
        // inspiration form http://codepen.io/agate1/pen/vOoRvj
        var item;
        var ul;

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
