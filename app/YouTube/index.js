'use strict';
var RSVP = require('rsvp');
var YTWrapper = function () {
  var api = {};
  api.loadVideo = function (element, params, tracking) {
    return new RSVP.Promise(function (resolve, reject) {
      var duration = null;
      var player = null;
      var videoStart = 0;
      var videoTwentyFive = 0;
      var videoFifty = 0;
      var videoSeventyFive = 0;
      var videoOneHundred = 0;
      var isMuted = false;
      var quartileOne = true;
      var quartileTwo = true;
      var quartileThree = true;
      var quartileFour = true;
      var quartileEnd = true;
      var isEnded = false;
      var time = null;
      var timer = null;
      if (isNaN(params.playerVars.end) === false) {
        duration = params.playerVars.end;
      }
      var playerLoadedHandler = function (e) {
        if (duration === null) {
          duration = e.target.getDuration();
        }
        videoStart = 0;
        videoTwentyFive = duration * 0.25;
        videoFifty = duration * 0.5;
        videoSeventyFive = duration * 0.75;
        videoOneHundred = duration * 0.97;
        isMuted = player.isMuted();
        player.removeEventListener('onReady', playerLoadedHandler);
        player.addEventListener('onStateChange', stateChangeHandler);

        player.hookDestroy = function () {
          return new RSVP.Promise(function (resolve, reject) {
            player.removeEventListener('onStateChange', stateChangeHandler);
            player.destroy()
            resolve({},'YT Player Destroy Promise')
          })
        };
        resolve(player, 'YT Player Load Promise');
      };
      var stateChangeHandler = function (e) {

        // if video has ended event
        if (e.data === YT.PlayerState.ENDED) {
          isEnded = true;
          quartileOne = true;
          quartileTwo = true;
          quartileThree = true;
          quartileFour = true;
          quartileEnd = true;
          tracking.quart_100.call();
          tracking.end.call();
        }
        if (e.data === YT.PlayerState.PLAYING) {
          if (isEnded) {
            isEnded = false;
            tracking.replay.call();
          } else {
            tracking.play.call();
          }
          timer = window.requestAnimationFrame(frameTick);
        }
        if (e.data === YT.PlayerState.PAUSED) {
          tracking.pause.call();
        }
      };
      var frameTick = function () {
        if (player === null) {
          return false;
        }
        time = player.getCurrentTime();
        // DC Counters
        if (time >= videoStart && quartileOne && player.getPlayerState() === 1) {
          tracking.quart_0.call();
          quartileOne = false;
        }
        if (time >= videoTwentyFive && quartileTwo && player.getPlayerState() === 1) {
          tracking.quart_25.call();
          quartileTwo = false;
        }
        if (time >= videoFifty && quartileThree && player.getPlayerState() === 1) {
          tracking.quart_50.call();
          quartileThree = false;
        }
        if (time >= videoSeventyFive && quartileFour && player.getPlayerState() === 1) {
          tracking.quart_75.call();
          quartileFour = false;
        }
        if (time >= videoOneHundred && quartileEnd && player.getPlayerState() === 1) {
          quartileEnd = false;
        }
        if (isMuted !== player.isMuted()) {
          isMuted = player.isMuted();
          if (isMuted) {
            tracking.muted.call();
          } else {
            tracking.unmuted.call();
          }
        }
        timer = window.requestAnimationFrame(frameTick);
      };
      player = new YT.Player(element, params);
      player.addEventListener('onReady', playerLoadedHandler);
    })
  };
  return api;
};
var LoadAPI = function () {
  return new RSVP.Promise(function (resolve, reject) {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = function () {
      console.log('yt loaded');
      resolve();
    }
  })
};
var ConfigNoHistory = function (height, width, id, length) {
  var playerVars = {
    rel: 0,
    showinfo: 0,
    enablejsapi: 1,
    disablekb: 1,
    iv_load_policy: 3,
    cc_load_policy: 0,
    adformat: '1_8', // prevents video from showing up in user YT history so auto play videos don't get flagged as spam
    controls: 0,
    html5: 1,
    origin: document.domain,
    fs: 0
  };
  if (!isNaN(length)) {
    playerVars.end = length;
  }
  return {
    height: height,
    width: width,
    videoId: id,
    playerVars: playerVars
  };
};
var ConfigWithHistory = function (height, width, id, length) {
  var playerVars = {
    rel: 0,
    showinfo: 0,
    enablejsapi: 1,
    disablekb: 1,
    iv_load_policy: 3,
    cc_load_policy: 0,
    controls: 1,
    html5: 1,
    origin: document.domain,
    fs: 0
  };
  if (!isNaN(length)) {
    playerVars.end = length;
  }
  return {
    height: height,
    width: width,
    videoId: id,
    playerVars: playerVars
  };
};
var ManifestFactory = function (play, pause, end, replay, muted, unmuted, quart_0, quart_25, quart_50, quart_75, quart_100) {
  var manifest = null;
  if (play === "undefined" || play === undefined) {
    manifest = {
      play: function () {
        console.log('DEFAULT VIDEO playing');
      },
      pause: function () {
        console.log('DEFAULT VIDEO paused');
      },
      end: function () {
        console.log('DEFAULT VIDEO ended');
      },
      replay: function () {
        console.log('DEFAULT VIDEO replay');
      },
      muted: function () {
        console.log('DEFAULT VIDEO Muted');
      },
      unmuted: function () {
        console.log('DEFAULT VIDEO Unmuted');
      },
      quart_0: function () {
        console.log('DEFAULT VIDEO Percent 0');
      },
      quart_25: function () {
        console.log('DEFAULT VIDEO Percent 25');
      },
      quart_50: function () {
        console.log('DEFAULT VIDEO Percent 50');
      },
      quart_75: function () {
        console.log('DEFAULT VIDEO Percent 75');
      },
      quart_100: function () {
        console.log('DEFAULT VIDEO Percent 100');
      }
    };
  } else {
    manifest = {
      play: play,
      pause: pause,
      end: end,
      replay: replay,
      muted: muted,
      unmuted: unmuted,
      quart_0: quart_0,
      quart_25: quart_25,
      quart_50: quart_50,
      quart_75: quart_75,
      quart_100: quart_100
    };
  }
  return manifest;
}
module.exports = {
  YTWrapper: YTWrapper,
  ConfigNoHistory: ConfigNoHistory,
  ConfigWithHistory: ConfigWithHistory,
  LoadAPI: LoadAPI,
  MakeManifest: ManifestFactory
};