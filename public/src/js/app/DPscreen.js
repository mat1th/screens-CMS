DP.screens = (function() {
    var _inputPreview = DP.helper.selectId('input-preview');
    //get the data from the specific vimeo id
    var _setVimeoForm = function() {
        var client = new DP.helper.getData(),
            fieldVimeoId = DP.helper.selectId('field-vimeo-id'),
            vimeoIdError = DP.helper.selectId('vimeo-id-error'),
            fieldname = DP.helper.selectId('field-name'),
            fieldDiscription = DP.helper.selectId('field-discription'),
            fieldVimeoImage = DP.helper.selectId('field-vimeoImage'),
            vimeoImage = DP.helper.selectId('vimeo-image'),
            fieldDuration = DP.helper.selectId('field-duration');

            vimeoImage.classList.add('none');

        fieldVimeoId.addEventListener('blur', function(e) {
            client.get('http://vimeo.com/api/v2/video/' + e.target.value + '.json', function(response) {
                if (response !== 'error') {
                    fieldVimeoId.classList.remove('error');
                    var data = JSON.parse(response)[0];
                    console.log(data);
                    vimeoIdError.innerHTML = '';
                    fieldDiscription.value = data.description;
                    fieldname.value = data.title;
                    fieldDuration.value = data.duration;
                    fieldVimeoImage.value = data.thumbnail_large;
                    _inputPreview.src = data.thumbnail_large;

                } else {
                    fieldVimeoId.classList.add('error');
                    vimeoIdError.innerHTML = 'Fill only the id, not the whole url';
                    console.log('there was a error');
                }
            });
        });
    };

    //if a file select ad the selected image to the html
    var uploadPreview = function() {
        var fieldFile = DP.helper.selectId('field-file'),
            filename = DP.helper.selectId('filename');

        function readURL(event) {
            _inputPreview.src = URL.createObjectURL(event.target.files[0]);
            filename.innerHTML = event.target.files[0].name;
        }
        fieldFile.addEventListener('change', function(e) {
            readURL(e);
        });
    };
    var watchOptions = function() {
        var radioOptionField = DP.helper.selectId('radio-option-field'),
            fileInput = DP.helper.select('.file-input'),
            vimeoIdInput = DP.helper.selectId('vimeo-id-input');

        //disable vimeoID input
        vimeoIdInput.classList.add('none');

        radioOptionField.addEventListener('change', function(e) {
            console.log(e.target.value);
            if (e.target.value === 'poster') {
                fileInput.classList.remove('none');
                vimeoIdInput.classList.add('none');
            } else {
                fileInput.classList.add('none');
                vimeoIdInput.classList.remove('none');
            }
        });
        _setVimeoForm();
    };

    var init = function() {
        // _setVimeoForm('125229524');
        watchOptions();
        uploadPreview();
    };
    return {
        init: init
    };
})();
