'use strict';
(function() {
    var Ad = function() {
        try {
            console.log('Hello World ' + bowser.name + ' ' + bowser.version);
        } catch (err) {}
        var api = {};
        var dynamicEnabled;
        var rootSource = null;
        var currentAnimationKill = null;
        var firstRun = false;
        var buildRoot = function() {
            var newRoot = rootSource.cloneNode(true);
            var oldRoot = document.getElementById("adRoot");
            document.body.replaceChild(newRoot, oldRoot)
        };
        var show = function() {
            var toShow = document.querySelectorAll('.invisible');
            for (var i = 0; i < toShow.length; i++) {
                toShow[i].classList.remove('invisible');
            }
            var unhide = document.querySelectorAll('.hidden');
            for (var j = 0; j < unhide.length; j++) {
                unhide[j].classList.remove('hidden');
            }
        };
        var writeHTML = function(div, text) {
            div.innerHTML = text;
            console.log('loading done', div.id);
        };
        var processSVG = function(svgObj) {
            for (var prop in svgObj) {
                try {
                    // accomodate using dynamics or not
                    if (dynamicEnabled) {
                        writeHTML(document.getElementById(prop), window.dynamicTemplate.process(svgObj[prop]))
                    }else {
                        writeHTML(document.getElementById(prop), svgObj[prop])
                    }

                    
                } catch (err) {
                    console.log('dynamicEnabled', dynamicEnabled);
                  // handle dynamic SVGs
                    var success = false;
                    var divs = document.getElementsByTagName("div");
                    for (var i = 0; i < divs.length; i++) {
                        var theDiv = divs[i];
                        if (theDiv.hasAttribute('inject')) {
                            var theAttr = theDiv.getAttribute('inject');
                            if (theAttr.search(prop) !== -1) {
                                writeHTML(theDiv, window.dynamicTemplate.process(svgObj[prop]));
                                success = true;
                            }
                        }
                    }
                    if (success) {
                        console.log('Ad Template: Dynamic SVG Inlined:', prop + ".svg");
                    } else {
                        console.warn('Ad Template: Could not add SVG file:',prop + '.svg. No element found with ID #'+prop);
                        // console.error(err);
                    }
                }
            }
        };

        var setUpAd = function() {
            var callback = function() {
                processSVG(window.bannerSvgData);
                show();
                rootSource = document.getElementById("adRoot").cloneNode(true);
                currentAnimationKill = Animation();
            };
            var loader = window.svgImageLoader;
            loader(window.bannerSvgData, callback);
        };
        api.init = function(isDynamicEnabled) {
            if (firstRun) {
                return
            }

            dynamicEnabled = isDynamicEnabled;
            firstRun = true;
            console.log('ad int');
            setUpAd();
        };
        api.replay = function() {
            currentAnimationKill();
            buildRoot();
            Animation();
        };
        return api;
    };
    window.ad = Ad();
})();