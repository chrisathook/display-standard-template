'use strict';
(function () {
  var Animation = function () {

    var onComplete = function () {
      console.log('animation complete');
      document.getElementById('cta').addEventListener('click', clickHandler)
      document.getElementById('catchAll').addEventListener('click', clickHandler)
    };
    var onStart = function () {
    };
    var render = function () {
      var tl = null;
      // make additional timeline here.
      tl = new TimelineMax({
        onComplete: onComplete,
        onStart: onStart
      });
      tl.add(TweenMax.to('#adRoot', 1, {opacity: 1}));
      return function destroy () {
        console.log ('Kill Animations' );
        tl.kill();
      }
    };
    return render();
  };
  window.Animation = Animation;
})();
