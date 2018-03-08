'use strict';
(function() {
    var DynamicTemplate = function() {
        var api = {};

        api.process = function(string) {
            if(!window.previewData) return string;
            var result = string;
            for(var key in window.previewData){
                var value = window.previewData[key]
                result = result.replace(new RegExp('{{'+key+'}}','g'), value);
            }

            return result;
        }

        return api;
    };
    window.dynamicTemplate = DynamicTemplate();
})();