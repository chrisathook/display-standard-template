'use strict';
(function () {
  var Animation = function () {
    // do all your animation in this function. Including any calls to get DOM elements.
    var render = function () {
      var ctaButton = document.getElementById('cta');
      var overHandler = function () {
        ctaButton.classList.add('cta-hover');
      };

      var outHandler = function () {
        ctaButton.classList.remove('cta-hover');
      };

      var onComplete = function () {
        console.log('animation complete');
        ctaButton.addEventListener('mouseover', overHandler);
        ctaButton.addEventListener('mouseout', outHandler);
      };

      var onStart = function () {
        document.getElementById('catchAll').addEventListener('click', clickHandler);
        ctaButton.addEventListener('click', clickHandler);
        ctaButton.addEventListener('click', outHandler);
      };
      
      var tl = null;
      // make additional timeline here.
      tl = new TimelineLite({
        onComplete: onComplete,
        onStart: onStart
      });
      // shows the main #adRoot container. feel free to replace with a tween if you'd like to transition the whole ad into visibility.
      tl.add(TweenLite.set('#adRoot', {opacity: 1}));
      // customize this function so that when called it kills all animation timelines, etc.
      return function destroy() {
        console.log('Kill Animations');
        tl.kill();
      }
    };
    return render();
  };
  window.Animation = Animation;
})();
