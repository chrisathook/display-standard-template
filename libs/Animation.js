'use strict';
(function () {
  var Animation = function () {
    // do all your animation in this function. Including any calls to get DOM elements.
    var render = function () {
      var onComplete = function () {
        console.log('animation complete');
        document.getElementById('cta').addEventListener('click', clickHandler);
        document.getElementById('catchAll').addEventListener('click', clickHandler)
      };
      var onStart = function () {
      };
      var tl = null;
      // make additional timeline here.
      tl = new TimelineLite({
        onComplete: onComplete,
        onStart: onStart
      });
      tl.add(TweenLite.to('#adRoot', 1, {opacity: 1}));
      //customize this function so that when called it kills all animation timelines, etc.
      return function destroy() {
        console.log('Kill Animations');
        tl.kill();
      }
    };
    return render();
  };
  window.Animation = Animation;
})();
