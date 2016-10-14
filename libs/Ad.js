'use strict';
(function () {
  var Ad = function () {

    try {console.log('Hello World ' + bowser.name + ' ' + bowser.version);}catch (err){}
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
        toShow[i].classList.remove('invisible');
      }
      var unhide = document.querySelectorAll('.hidden');
      for (var j = 0; j < unhide.length; j++) {
        unhide[j].classList.remove('hidden');
      }
    };
    api.init = function () {
      if (firstRun) {
        return
      }
      firstRun = true;
      console.log('ad int');
      show();
      rootSource = document.getElementById("adRoot").cloneNode(true);
      currentAnimationKill = Animation();
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
