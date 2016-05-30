DP.slideshows = (function() {
    var _plusButton = DP.helper.select('.add'),
        _plusButtonIcon = DP.helper.select('.add svg'),
        _selector = DP.helper.select('.slideshow-picker');

    var _addNewPoster = function() {
        _plusButton.addEventListener('click', function() {
            _selector.classList.toggle('none');
            _plusButtonIcon.classList.toggle('rotate-right');
        });
    };

    var init = function() {
        _addNewPoster();
    };

    return {
        init: init
    };
})();
