DP.content = (function() {
    var _inputPreview = DP.helper.selectId('input-preview'),
        _preview = DP.helper.selectId('preview'),

         /**
          *_setVimeoForm gets the vimeo id from the input filed and sets the data from the vimeo api in the other inputs fileds
          */
        _setVimeoForm = function() { //get the data from the specific vimeo id
            var client = new DP.helper.getData(),
                fieldVimeoId = DP.helper.selectId('field-vimeo-id'),
                vimeoIdError = DP.helper.selectId('vimeo-id-error'),
                fieldname = DP.helper.selectId('field-name'),
                fieldDiscription = DP.helper.selectId('field-discription'),
                fieldVimeoImage = DP.helper.selectId('field-vimeoImage'),
                vimeoImage = DP.helper.selectId('vimeo-image'),
                fieldDuration = DP.helper.selectId('field-duration');

            vimeoImage.classList.add('disabled');

            fieldVimeoId.addEventListener('blur', function(e) { // get the date from the vimeo api to auto fill in the form
                console.log(e.target.value);
                client.get('https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/' + e.target.value, function(response) {
                    if (response !== 'error') {
                        fieldVimeoId.classList.remove('error');
                        var data = JSON.parse(response); //parse the data
                        //set the data in the input fields
                        vimeoIdError.innerHTML = '';
                        fieldDiscription.value = data.description;
                        fieldname.value = data.title;
                        fieldDuration.value = data.duration;
                        fieldVimeoImage.value = data.thumbnail_url;
                        _inputPreview.src = data.thumbnail_url;
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
            _preview.setAttribute('class', 'disabled'); // use the setAttribute becorse it has better browser support
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
    //Add a animation to the poster preview. So the user knows what the animation wil be
    var animateSelect = function() {
        var select = DP.helper.selectId('field-animation');
        var animations = ['fadein', 'left-push', 'top-push'];

        select.addEventListener('change', function(e) {
            for (var i = 0; i < animations.length; i++) {
                _inputPreview.classList.remove(animations[i]);
            }
            _inputPreview.classList.add(e.target.value);
        });
    };
    /**
     * You can select the options for vimeo and the poster. Only the nessesery input fields will appear.
     */
    var watchOptions = function() {
        var radioOptionField = DP.helper.selectId('radio-option-field'),
            fileInput = DP.helper.select('.file-input'),
            vimeoIdInput = DP.helper.selectId('vimeo-id-input');

        //disable vimeoID input as default
        vimeoIdInput.classList.add('disabled');

        //lisssen to the option field and toggle the input fields
        radioOptionField.addEventListener('change', function(e) {
            if (e.target.value === 'poster') {
                fileInput.classList.remove('disabled');
                vimeoIdInput.classList.add('disabled');
            } else {
                fileInput.classList.add('disabled');
                vimeoIdInput.classList.remove('disabled');
            }
        });
        _setVimeoForm();
    };
    //validate the collor filed show a warning if the field is not #000 or #000000
    var colorValidate = function() {

        var fieldColor = DP.helper.selectId('field-color'),
            colorErr = DP.helper.selectId('color-error'),
            error = 'Please add a #fn0 color code'

        DP.validate.setErrorColor(fieldColor, colorErr, error); //validate the color of the color input field
    };
    //validate the data and show a error
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
    //run all functions. 
    var init = function() {
        DP.validate.form(); // validate the from on the page. If some elements are empty they will become red.
        watchOptions();
        uploadPreview();
        colorValidate();
        dataValidate();
        animateSelect();
    };
    return {
        init: init
    };
})();
