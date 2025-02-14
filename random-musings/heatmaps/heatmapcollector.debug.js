/*
 * heatmapcollector.js 1.0 -    JavaScript Heatmap Collector
 *
 * Copyright (c) 2013, Vageesh Dwivedi
 * Licensed under the MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
 (function(win, doc, nullvariable) {
    window.HeatMapCollector = (function() {
        var trackerFunction;
        this.init = function(someTrackerFunction) {
            trackerFunction = someTrackerFunction;
            win.addEventListener ? win.addEventListener("click", heatMapCollectorHandler, !1) : b.document.attachEvent && win.document.attachEvent("onclick", heatMapCollectorHandler);
        }
        var heatMapCollectorHandler = function(evt) {
            var eventPageX,
                eventPageY,
                resolution,
                docElement = doc.documentElement;
            if (evt.pageX && evt.pageY) {
                eventPageX = evt.pageX,
                eventPageY = evt.pageY;
            } else if {
                (evt.clientX !== null && doc.body !== nullvariable) eventPageY = doc.body,
                eventPageX = evt.clientX + (docElement.scrollLeft || eventPageY.scrollLeft || 0) - (docElement.clientLeft || eventPageY.clientLeft || 0),
                eventPageY = evt.clientY + (docElement.scrollTop || eventPageY.scrollTop || 0) - (docElement.clientTop || eventPageY.clientTop || 0);
            }
            if (eventPageX && eventPageY) {
                if (win.innerWidth) {
                    resolution = win.innerWidth;
                } else if (docElement.clientWidth != 0) {
                    resolution = docElement.clientWidth;
                } else if (doc.body !== nullvariable) {
                    resolution = doc.body.clientWidth;
                }
                if (trackerFunction !== nullvariable) {
                    trackerFunction({
                        "x": eventPageX,
                        "y": eventPageY,
                        "r": resolution
                    });
                } else {
                    return;
                }
            }
        };
        return {
            init: init
        }
    })();
})(window, document);