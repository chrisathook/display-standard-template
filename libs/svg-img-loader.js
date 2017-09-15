"use strict";
(function () {
  var svgImageLoader = function (svgData, callback) {
    var matchReg = /.\/[^/\s]+\/\S+\.(jpg|png|gif)/gi;
    var matches = [];
    for (var data in svgData) {
      var newMatches = svgData[data].match(matchReg);
      if (Array.isArray(newMatches) === true) {
        matches = matches.concat(svgData[data].match(matchReg));
      }
    }
    var count = 0;
    var loadComplete = function () {
      count++;
      console.log('svg image loaded');
      if (count === matches.length) {
        console.log('images in svgs loaded');
        callback.call();
      }
    };
    // handle no images in svgs
    if (matches.length ===0){
      console.log('no SVG embedded images to load');
      callback.call();
    }else {
      for (var i = 0; i < matches.length; i++) {
        var img = new Image();
        img.onload = loadComplete;
        img.src = matches[i];
        document.querySelector('#image-hack').appendChild(img);
      }
    }
    //console.log (svgData[data])
    console.log(matches);
  };
  window.svgImageLoader = svgImageLoader;
})();