DP.poster = (function() {
    var uploadPreview = function() {
        var field_file = DP.helper.select('#field_file'),
            input_preview = DP.helper.select('#input_preview')

        function readURL(input) {
            var files = input.target.files;
            if (files && files[0]) {
                var reader = new FileReader();

                reader.onload = function(event) {
                    input_preview.src = event.target.result
                }
                reader.readAsDataURL(files[0]);
            }
        }

        field_file.addEventListener("change", function(e) {
            readURL(e);
        });
    }
    return {
        uploadPreview: uploadPreview
    }
})();
