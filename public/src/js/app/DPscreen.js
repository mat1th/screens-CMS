DP.screens = (function() {
    //get the data from the specific vimeo id
    var _setVimeoForm = function() {
        var client = new DP.helper.getData(),
            fieldVimeoId = DP.helper.selectId('field-vimeo-id'),
            fieldname = DP.helper.selectId('field-name'),
            fieldDiscription = DP.helper.selectId('field-discription'),
            fieldDuration = DP.helper.selectId('field-duration');

        fieldVimeoId.addEventListener('blur', function(e) {
            client.get('http://vimeo.com/api/v2/video/' + e.target.value + '.json', function(response) {
                if (response !== 'error') {
                    fieldVimeoId.classList.remove('error');
                    var data = JSON.parse(response)[0];

                    fieldDiscription.value = data.description;
                    fieldname.value = data.title;
                    fieldDuration.value = data.duration;
                    console.log(data);
                } else {
                    fieldVimeoId.classList.add('error');
                    console.log('there was a error');
                }
            });
        });
    };



    //if a file select ad the selected image to the html
    var uploadPreview = function() {
        var fieldFile = DP.helper.selectId('field-file'),
            filename = DP.helper.selectId('filename'),
            inputPreview = DP.helper.selectId('input-preview');

        function readURL(input) {
            var files = input.target.files;
            filename.innerHTML = files[0].name;
            if (files && files[0]) {
                var reader = new FileReader();

                reader.onload = function(event) {
                    inputPreview.src = event.target.result;
                };
                reader.readAsDataURL(files[0]);
            }
        }
        fieldFile.addEventListener('click', function(e) {
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
            if (e.target.value === 'screen') {
                fileInput.classList.remove('none');
                vimeoIdInput.classList.add('none');
            } else {
                fileInput.classList.add('none');
                vimeoIdInput.classList.remove('none');
            }
        });
        _setVimeoForm()
    };

    var init = function() {
        // _setVimeoForm('125229524');
        watchOptions();
        uploadPreview();
    }
    return {
        init: init
    };
})();
