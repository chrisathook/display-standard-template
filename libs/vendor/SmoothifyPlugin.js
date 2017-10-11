/*!
 * VERSION: 0.1.0
 * DATE: 2016-12-05
 * 
 * @author: Craig Albert
 **/
var ua = navigator.userAgent.toLowerCase();
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isFirefox = typeof InstallTrigger !== 'undefined';
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
var isIE = /*@cc_on!@*/false || !!document.documentMode;
var isEdge = !isIE && !!window.StyleMedia;
var isChrome = !!window.chrome && !!window.chrome.webstore;
var isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isAndroid = /(android)/i.test(navigator.userAgent);

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

			
			if (isiOS || isAndroid ) {
				
				return false;
			}
			
			this._target = target;

			var tweenObject = {
				"rotation": 0.01, 
				"z": 0.1, 
				"transformPerspective": 1000
			}

			if (isIE || isSafari || isEdge) {
				tweenObject.z = 0;
			} else if(isFirefox && target.style.outline == "") {
				tweenObject.outline = "1px solid transparent";
			}
				
			TweenLite.set(target, tweenObject);
			
			return true;
		}
	});

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }