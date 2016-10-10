/**
 * Created by chriswatts on 9/29/16.
 */
'use strict';

var RSVP = require('rsvp');






module.exports = {

  removeChildren: function (domNode) {

    return new RSVP.Promise(function (resolve, reject) {


      while (domNode.hasChildNodes()) {
        domNode.removeChild(domNode.lastChild);
      }

      requestAnimationFrame(resolve);

    });


  }



};


