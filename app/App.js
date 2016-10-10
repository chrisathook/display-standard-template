'use strict';
var RSVP = require('rsvp');
var adKit = require('./hook-ad-kit/AdKit');
var shellAnimationController = require('./controllers/ShellAnimationController');
var collapsedAnimationController = require('./controllers/CollapsedAnimationController');
var expandedAnimationController = require('./controllers/ExpandedAnimationController');
var util = require('./hook-ad-kit/Util');

RSVP.on('error', function (reason, label) {
  if (label) {
    console.error(label);
  }
  console.assert(false, reason);
});
var App = function (config) {
  var collapsedPartial = config.collapsedPartial;
  var expandedPartial = config.expandedPartial;
  var isAutoExpand = config.isAutoExpand;
  var autoExpandTimer = config.autoExpandTimer;
  var expandedContainer = document.querySelector('#expandedContainer');
  var collapsedContainer = document.querySelector('#collapsedContainer');
  var expandedPreloader = document.querySelector('#expandedPreloader');
  console.log("hello app");
  //*************************************************************************************************
  // IMPLEMENTATION - YOu will need to edit these
  //*************************************************************************************************
  var preload = function () {
    console.log('preload');
    var promises = [];
    if (isAutoExpand === true) {
      promises.push(loadContent(expandedPartial, expandedContainer));
    } else {
      promises.push(loadContent(collapsedPartial, collapsedContainer));
    }
    // if you need to do more preloading do it here.

    return RSVP.all(promises)
  };
  var expand = function () {
    return adKit.requestExpand()
      .then(function () {
        return RSVP.all([
          shellAnimationController.expand(),
          shellAnimationController.preloaderAnimateIn()
        ])
      })
      .then(function () {
        return loadContent(expandedPartial, expandedContainer)
      }) // reload content on each expand
      .then(shellAnimationController.preloaderAnimateOut)
      .then(expandedAnimationController.animateIn)
      .then(bindExpanded)
      .then(function () {
        return util.removeChildren(collapsedContainer)
      })
      .then(function () {
        startTimer()
          .then(collapse)
          .catch(function (value) {
            console.log(value)
          })
      })// we don't return the promise here cuz we don't want the result holding execution
      .then(adKit.completeExpand)
      .catch(function (value) {
        console.log(value);
        console.log('failure on expand')
      })
  };
  var collapse = function () {
    return adKit.requestCollapse()
      .then(shellAnimationController.collapse)
      .then(function () {
        expandedContainer.classList.add('hidden');
      })
      .then(function () {
        return loadContent(collapsedPartial, collapsedContainer)
      })
      .then(collapsedAnimationController.animateIn)
      .then(bindCollapsed)
      .then(function () {
        return util.removeChildren(expandedContainer)
      })
      .then(adKit.completeCollapse)
      .then(function () {
        isAutoExpand = false
      })
      .catch(function (value) {
        console.log(value);
        console.log('failure on collapse')
      })
  };
  var run = function () {
    console.log('run');
    if (isAutoExpand === true) {
      return expand();
    } else {
      return collapsedAnimationController.animateIn()
        .then(bindCollapsed)
    }
  };
  //*************************************************************************************************
  // TEMPLATE - SHOULD NOT NEED TO MODIFY
  //*************************************************************************************************
  var init = function () {
    expandedPreloader.addEventListener('click', function () {
    });
    if (isAutoExpand === true) {
    } else {
      expandedContainer.classList.add('hidden');
    }
    adKit.boot()
      .then(preload)
      .then(run);
  };
  var loadContent = function (url, container) {
    console.log('loadContent');
    container.classList.remove('hidden');
    return adKit.loadPartial(url)
      .then(function (value) {
        return adKit.subloadPartial(container, value)
      });
  };
  var startTimer = function () {
    return new RSVP.Promise(function (resolve, reject) {
      if (autoExpandTimer === 0 || isAutoExpand === false) {
        reject('Timer reject ' + autoExpandTimer + ' ' + isAutoExpand + ' ' + adKit.expanded());
        return
      }
      console.log('Start Auto Timer', adKit.expanded());
      var func = function () {
        console.log('Auto Timer', adKit.expanded());
        if (adKit.expanded() === true) {
          resolve()
        } else {
          reject('Timer reject ' + autoExpandTimer + ' ' + isAutoExpand + ' ' + adKit.expanded());
        }
      };
      setTimeout(func, autoExpandTimer);
    })
  };
  var exitHandler = function () {
    if (adKit.expanded()) {
      collapse();
    }
  };
  var catchAllHandler = function () {
    return adKit.exit(function () {
        Enabler.exit('catch-all')
      })
      .then(exitHandler);
  };
  var ctaHandler = function () {
    return adKit.exit(function () {
        Enabler.exit('cta')
      })
      .then(exitHandler)
  };
  var bindCollapsed = function () {
    collapsedContainer.querySelector('.catch-all').addEventListener('click', catchAllHandler);
    collapsedContainer.querySelector('.cta').addEventListener('click', ctaHandler);
    collapsedContainer.querySelector('.expand').addEventListener('click', expandHandler);
  };
  var bindExpanded = function () {
    expandedContainer.querySelector('.catch-all').addEventListener('click', catchAllHandler);
    expandedContainer.querySelector('.cta').addEventListener('click', ctaHandler);
  };
  var expandHandler = function () {
    return expand();
  };
  return init();
};
module.exports = App;