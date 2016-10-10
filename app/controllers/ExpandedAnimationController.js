/**
 * Created by chriswatts on 9/29/16.
 */
'use strict';
var RSVP = require('rsvp');
module.exports = {
  animateIn: function () {
    return new RSVP.Promise(
      function (resolve, reject) {
        var content = document.querySelector('#expandedContainer').querySelector('.content');
        var tl = new TimelineMax(
          {
            onComplete: function () {
              console.log('expand animation complete');
              resolve(tl)
            }
          }
        );
        tl.add([
          TweenMax.to(content, 1, {opacity: 1})
        ]);
      })
  }
};


