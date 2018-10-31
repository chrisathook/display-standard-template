'use strict';
(function () {
  var Animation = function () {
    
    var smoothdivs = document.getElementById('adRoot').querySelectorAll('div');
        if (bowser.chrome && bowser.version > 63) {
       //alert('Hello Chrome64');
       TweenMax.set('svg path', {y:"-=.1"});
       TweenMax.set('svg circ', {y:"-=.1"});
       TweenMax.set('svg rect', {y:"-=.1"});
// add transformPerspective: 1000 if no 3D and scaling images
       TweenMax.set(smoothdivs, {smoothify: false});
    } else {
		  TweenMax.set('svg g', {rotation: "+=0.01"});
          TweenMax.set('svg path', {rotation: "+=0.01"});
          TweenMax.set('svg rect', {rotation: "+=0.01"});
          TweenMax.set('svg circ', {rotation: "+=0.01"});
		  TweenMax.set(smoothdivs, {smoothify: true});
       }
    
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
  
      window.endframe = function () { // this is used to show the end state of the ad, so that the dynamic ad generator can get a good screenshot.
        tl.seek(15)
      }
          console.log('!!! BROWSER CHECK', bowser.name, bowser.safari, parseFloat(bowser.version));
    if (bowser.safari === true && parseFloat(bowser.version) >= 12) {
        console.log("!!!!! safari timing hack");
        window.addEventListener('blur', function () {
            console.log("!!!!! Timing Hack Engaged");
            TweenMax.ticker.useRAF(false);
//    TweenMax.ticker.fps(60);
            TweenMax.lagSmoothing(0);
        });
    }
      
      
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
