DP.content = (function() {
    var _inputPreview = DP.helper.selectId('input-preview'),
        _preview = DP.helper.selectId('preview'),
        _setVimeoForm = function() { //get the data from the specific vimeo id
            var client = new DP.helper.getData(),
                fieldVimeoId = DP.helper.selectId('field-vimeo-id'),
                vimeoIdError = DP.helper.selectId('vimeo-id-error'),
                fieldname = DP.helper.selectId('field-name'),
                fieldDiscription = DP.helper.selectId('field-discription'),
                fieldVimeoImage = DP.helper.selectId('field-vimeoImage'),
                vimeoImage = DP.helper.selectId('vimeo-image'),
                fieldDuration = DP.helper.selectId('field-duration');

            vimeoImage.classList.add('none');

            fieldVimeoId.addEventListener('blur', function(e) { // get the date from the vimeo api to auto fill in the form
                client.get('http://vimeo.com/api/v2/video/' + e.target.value + '.json', function(response) {
                    if (response !== 'error') {
                        fieldVimeoId.classList.remove('error');
                        var data = JSON.parse(response)[0];

                        vimeoIdError.innerHTML = '';
                        fieldDiscription.value = data.description;
                        fieldname.value = data.title;
                        fieldDuration.value = data.duration;
                        fieldVimeoImage.value = data.thumbnail_large;
                        _inputPreview.src = data.thumbnail_large;
                    } else {
                        fieldVimeoId.classList.add('error');
                        vimeoIdError.innerHTML = 'Fill only the id, not the url';
                        console.log('There was a error with the vimeo API or input');
                    }
                });
            });
        };

    //if a file select ad the selected image to the html
    var uploadPreview = function() {
        var fieldFile = DP.helper.selectId('field-file'),
            fieldColor = DP.helper.selectId('field-color'),
            previewSize = DP.helper.select('.preview-size'),
            filename = DP.helper.selectId('filename');

        //check if the url is supported
        if (URL) {
            fieldFile.addEventListener('change', function(e) { //lissen to the canges from the file input field
                readURL(e);
            });
        } else {
            //disable the preview id the URL API is not supported
            _preview.setAttribute('class', 'none'); // use the setAttribute becorse it has better browser support
        }
        //lisssen to the collor field an set the background from the field the filled collor
        fieldColor.addEventListener('input', function(e) {
            previewSize.setAttribute('style', 'background:' + e.target.value);
        });

        //set the image preview to the selelected image (it will only be used if the URL is supported)
        function readURL(event) {
            _inputPreview.src = URL.createObjectURL(event.target.files[0]);
            filename.innerHTML = event.target.files[0].name;
        }
    };

    var watchOptions = function() {
        var radioOptionField = DP.helper.selectId('radio-option-field'),
            fileInput = DP.helper.select('.file-input'),
            vimeoIdInput = DP.helper.selectId('vimeo-id-input');

        //disable vimeoID input
        vimeoIdInput.classList.add('none');

        radioOptionField.addEventListener('change', function(e) {
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
    var colorValidate = function() {
        var fieldColor = DP.helper.selectId('field-color'),
            colorErr = DP.helper.selectId('color-error'),
            error = 'Please add a #fn0 color code'

        DP.validate.setErrorColor(fieldColor, colorErr, error); //validate the color of the color input field
    };
    var dataValidate = function() {
        var startDateField = DP.helper.selectId('field-date-start'),
            dateStartErr = DP.helper.selectId('date-start-error'),
            endDateField = DP.helper.selectId('field-date-end'),
            stareDatetErr = DP.helper.selectId('date-end-error'),
            error = 'Please fill in a valid date'; // the error message
        //validate the dates
        DP.validate.setErrorDate(startDateField, dateStartErr, error);
        DP.validate.setErrorDate(endDateField, stareDatetErr, error);
    };

    var init = function() {
        DP.validate.form(); // validate the from on the page. If some elements are empty they will become red.
        watchOptions();
        uploadPreview();
        colorValidate();
        dataValidate();
    };
    return {
        init: init
    };
})();
