'use strict';
(function () {
  var Ad = function () {
    console.log('Hello World ' + bowser.name + ' ' + bowser.version);
    var api = {};
    var rootSource = null;

    var currentAnimationKill = null;

    var firstRun = false;
    var buildRoot = function () {
      var newRoot = rootSource.cloneNode(true);
      var oldRoot = document.getElementById("adRoot");
      document.body.replaceChild(newRoot, oldRoot)
    };
    var show = function () {
      var toShow = document.querySelectorAll('.invisible');
      for (var i = 0; i < toShow.length; i++) {
        var obj = toShow[i];
        obj.classList.remove('invisible');
      }
    };
    api.init = function () {

      if (firstRun) { return}
      firstRun = true;
      console.log('ad int');
      show();
      rootSource = document.getElementById("adRoot").cloneNode(true);
      currentAnimationKill =Animation();
    };
    api.replay = function () {
      currentAnimationKill();
      buildRoot();
      Animation();
    };
    return api;
  };
  window.ad = Ad();
})();
