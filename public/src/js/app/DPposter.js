DP.poster = (function() {
    var uploadPreview = function() {
        var fieldFile = DP.helper.select('#field_file'),
            inputPreview = DP.helper.select('#input_preview');

        function readURL(input) {
            var files = input.target.files;
            if (files && files[0]) {
                var reader = new FileReader();

                reader.onload = function(event) {
                    inputPreview.src = event.target.result;
                };
                reader.readAsDataURL(files[0]);
            }
        }

        fieldFile.addEventListener('change', function(e) {
            readURL(e);
        });
    };
    return {
        uploadPreview: uploadPreview
    };
})();
 // http://vimeo.com/api/v2/video/125229524.json
