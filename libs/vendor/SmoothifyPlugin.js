/*!
 * VERSION: 0.1.0
 * DATE: 2016-12-05
 * 
 * @author: Craig Albert
 **/
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isFirefox = typeof InstallTrigger !== 'undefined';
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
var isIE = /*@cc_on!@*/false || !!document.documentMode;
var isEdge = !isIE && !!window.StyleMedia;
var isChrome = !!window.chrome && !!window.chrome.webstore;

var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {
	//ignore the line above this and at the very end - those are for ensuring things load in the proper order
	"use strict";

	_gsScope._gsDefine.plugin({
		propName: "smoothify", //the name of the property that will get intercepted and handled by this plugin
		priority: 1,
		API: 2,
		version: "0.1.0",
		overwriteProps: ["rotation", "z", "transformPerspective"],
		init: function(target, value, tween, index) {

			if(!value) {
				return false;
			}

			this._target = target; 

			if (isIE || isSafari || isEdge) {
				TweenLite.set(target, {"rotation": 0.01, "z": 0, "transformPerspective": 1000});
			} else {
				TweenLite.set(target, {"rotation": 0.01, "z": 0.1, "transformPerspective": 1000});
			}

			return true;
		}
	});

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }