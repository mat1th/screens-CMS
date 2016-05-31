DP.slideshows = (function() {
    var _plusButton = DP.helper.select('.add'),
        _plusButtonIcon = DP.helper.select('.add svg'),
        _selector = DP.helper.select('.slideshow-picker'),
        _imagerowLi = DP.helper.selectAll('.imagerow');


    var _addNewPoster = function() {
        _plusButton.addEventListener('click', function() {
            _selector.classList.toggle('none');
            _plusButtonIcon.classList.toggle('rotate-right');
        });
    };
    var _sortable = function() {
        // inspiration form http://codepen.io/agate1/pen/vOoRvj
        var item;
        var ul;
        var posterrow = DP.helper.select('#posterrow');
        var posteritems = DP.helper.selectAll('.posteritem');

        posterrow.addEventListener('dragenter', function(ev) {
            ev.preventDefault();
            if (listNumber(ev.target) > listNumber(item)) {
                ul.insertBefore(ev.target, item);
            } else {
                ul.insertBefore(item, ev.target);
            }
            return true;
        });

        posterrow.addEventListener('dragend', function() {
            item.classList.remove('placeholder');
            return false;
        });
        posterrow.addEventListener('drop', function functionName(ev) {
            ev.stopPropagation();
            return false;
        });
        posterrow.addEventListener('dragover', function functionName() {
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

    var init = function() {
        _addNewPoster();
        _sortable();
    };

    return {
        init: init
    };
})();
