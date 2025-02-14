if (typeof SN === "undefined") {
    SN = {};
}
if (typeof SN.WOWPx === "undefined") {
    SN.WOWPx = {};
}

var customParams = WOWPx.getWoWPxParams();
var pxoeWin = WOWPx.getPxOEWindow();
var moduleShowing = "";
var objStore = Store.getStore("wowpxstore");
var addHandlerCount = 0;
var recordMoviesProxyFlag = false;
window.ytData = {};
var qty = parent.GetTVCount ? parseInt(parent.GetTVCount()) : 0;

var inviteAppConfigs = {
    inviteType: "static",
    ignoreTimeout: "120000",
    uiType: "VER_TVC01_01"
};

SN.WOWPx.Effects = (function () {
    var fadeDone = false;

    function doSlideIn(elem, start, end, duration, callback) {
        var startTimer = new Date().getTime();
        elem.slideIn = window.setInterval(function () {
            var elapsed = (new Date().getTime()) - startTimer;
            elem.scrollTop = easeInOutCubic(elapsed, start, end - start, duration);
            if (elapsed > duration) {
                window.clearInterval(elem.slideIn);
                if (callback) {
                    callback();
                }
            }
        }, 50);
    }

    function doSlideOut(elem, start, end, duration, callback) {
        var startTimer = new Date().getTime();
        elem.slideIn = window.setInterval(function () {
            var elapsed = (new Date().getTime()) - startTimer;
            elem.scrollTop = easeInOutCubic(elapsed, start, end - start, duration);
            if (elapsed > duration) {
                window.clearInterval(elem.slideIn);
                if (callback) {
                    callback();
                }
            }
        }, 50);
    }

    function doFadeOut(elem, start, end, duration, callback) {
        fadeDone = false;
        var startTimer = new Date().getTime();
        elem.fadeOut = window.setInterval(function () {
            if (fadeDone) return;
            var elapsed = (new Date().getTime()) - startTimer;
            var opacity = easeOutQuart(elapsed, start, end - start, duration);
            opacity = Math.ceil(opacity);
            var object = elem.style;
            object.opacity = (opacity / 100);
            object.MozOpacity = (opacity / 100);
            object.KhtmlOpacity = (opacity / 100);
            object.filter = "alpha(opacity=" + opacity + ")";
            if (elapsed > duration) {
                fadeDone = true;
                window.clearInterval(elem.fadeOut);
                if (callback) {
                    callback();
                }
            }
        }, 50);
    }
    /* t = elapsed time
     * b = initialValue
     * c = amountOfChange
     * d = duration in msec
     */
    function easeInOutCubic(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };

    function easeInQuart(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    };

    function easeOutQuart(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    return {
        doSlideIn: doSlideIn,
        doSlideOut: doSlideOut,
        doFadeOut: doFadeOut
    }
})();

SN.WOWPx.setupAccordian = function (accordianContainer) {
    var accordianContainerEl = (typeof accordianContainer == "string") ? document.getElementById(accordianContainer) : accordianContainer;
    if (accordianContainerEl == null || typeof accordianContainerEl == "undefined") {
        return;
    }
    var accordianChildren = accordianContainerEl.getElementsByTagName("div");
    var accordianHeaders = [];
    var accordianContents = [];
    var activeElem;

    for (var i = 0; i < accordianChildren.length; i++) {
        if (accordianChildren[i].id.match(/_header$/) != null) {
            accordianHeaders.push(accordianChildren[i]);
        }
        if (accordianChildren[i].id.match(/_content$/) != null) {
            accordianContents.push(accordianChildren[i]);
        }
    }
    if (accordianHeaders.length != accordianContents.length) {
        return;
    }
    for (var i = 0; i < accordianHeaders.length; i++) {
        setupClickHandler(accordianHeaders[i], i);
    }

    function setupClickHandler(header, elem) {
        header.onclick = function (e) {
            //SN.WOWPx.Controller.deregisterIgnoreTimeout();
            if (activeElem == elem) {
                toggleActive(elem);
            } else {
                makeActive(elem);
            }
        }
    }

    function toggleActive(elem) {
        if (accordianContents[elem].style.display == "none") {
            accordianContents[elem].style.display = "block";
            accordianContents[elem].style.height = "auto";
            activeElem = elem;
            toggleClass(elem, 1);
        } else {
            accordianContents[elem].style.display = "none";
            accordianContents[elem].style.height = "0px";
            toggleClass(elem, 0);
        }
    }

    function makeActive(elem) {
        for (var i = 0; i < accordianContents.length; i++) {
            accordianContents[i].style.display = "none";
            accordianContents[i].style.height = "0px";
            toggleClass(i, 0);
        }
        activeElem = elem;
        accordianContents[elem].style.display = "block";
        accordianContents[elem].style.height = "auto";
        toggleClass(elem, 1);
    }

    function toggleClass(elem, active) {
        var el = accordianHeaders[elem].getElementsByTagName("div")[0].getElementsByTagName("div")[0];
        if (!el) return;
        var klassName = el.className;
        if (klassName.match(/header_highlight/) != null || active == 0) {
            var newKlass = klassName.replace(/\sheader_highlight/, '');
            el.className = newKlass;
        } else {
            el.className = klassName + ' header_highlight';
        }
    }
}

SN.WOWPx.SliderPanelControl = function (id) {
    var containerElem = document.getElementById(id);
    var slideCaller = "";
    var isOpen = false;
    var sliderState = "0"; /* 0 closed; 1 minimized; 2 open;*/

    function scrollToBottom() {
        containerElem.scrollTop = containerElem.scrollHeight;
    }

    function scrollToTop() {
        containerElem.scrollTop = 0;
    }

    function showModuleContent(module) {
        //hideLoading();
        containerElem.innerHTML = Jaml.render(module);
        //sliderPanelScroll.resize();
    }

    function hideScrollBar() {
        sliderPanelScroll.hide();
    }

    function showScrollBar() {
        sliderPanelScroll.show();
        sliderPanelScroll.resize();
    }

    function open(callback) {
        if (sliderState == "0" || sliderState == "1") {
            //SN.WOWPx.Controller.hideScrollBars();
            document.getElementById("slider-panel-container").style.display = "block";
            WOWPx.style({
                "width": "751px"
            });
            if (slideCaller == "click" || sliderState == "1") {
                emile("slide-out-logo", "width: 0px;", {
                    "duration": 500
                });
                emile("slide-out-button", "width: 0px;", {
                    "duration": 500
                });
            }
            emile("slider-panel-container", "width: 445px;", {
                "duration": 1000
            }, function () {
                callback();
                isOpen = true;
                slideCaller = "";
                sliderState = "2";
                //SN.WOWPx.Controller.showScrollBars();
                document.getElementById("slider-panel").style.display = "block";
            });
        } else if (sliderState == "2") {
            close(function () {
                open(callback);
            });
        }
    }

    function sliderOpen(evt) {
        slideCaller = "click";
        open(function () {
            document.getElementById("slider-panel-module-content").style.display = "block";
        });
    }

    function close(callback) {
        //hideScrollBars();
        document.getElementById("slider-panel").style.display = "none";
        emile("slider-panel-container", "width: 0px;", {
            "duration": 1000
        }, function () {
            if (slideCaller == "click") {
                emile("slide-out-logo", "width: 10px;", {
                    "duration": 300
                });
                emile("slide-out-button", "width: 16px;", {
                    "duration": 300
                });
                document.getElementById("slide-out-button").style.display = "block";
                sliderState = "1";
            } else {
                //document.getElementById("slide-out-button").style.display = "none";
                sliderState = "0";
            }
            WOWPx.style({
                "width": "300px"
            });
            isOpen = false;
            slideCaller = "";
            document.getElementById("slider-panel-container").style.display = "none";
            callback();
            //SN.WOWPx.Controller.showScrollBars();
        });
    }

    function sliderClose(evt) {
        slideCaller = "click";
        close(function () {
            document.getElementById("slider-panel-module-content").style.display = "none";
        });
    }

    function initialize() {
        //        sliderPanelScroll = containerElem.niceScroll({cursorcolor:"#aaa", cursorborder: "0px solid", autohidemode: false, railoffset: {top :-3, left:0}});
    }

    initialize();

    return {
        showModuleContent: showModuleContent,
        scrollToTop: scrollToTop,
        scrollToBottom: scrollToBottom,
        showScrollBar: showScrollBar,
        hideScrollBar: hideScrollBar,
        open: open,
        close: close,
        isOpen: function () {
            return isOpen;
        },
        sliderState: function () {
            return sliderState;
        }
    };
};

SN.WOWPx.Controller = (function (config) {
    var lastactionmap = {};
    var ignoreTimeoutId;

    function handleAppInteractionEvent(memo) {
        var data = {};
        //window.clearTimeout(ignoreTimeoutId);
        switch (memo.type) {
            case "vzn_10001_minimize":
                data = {
                    "eventId": "400214",
                    "data": {
                        "f": {
                            "o": {
                                "c201": getStepNameByModule(),
                                "id": inviteAppConfigs.uiType
                            }
                        }
                    }
                };
                WOWPx.track(data, function () {});
                break;
            case "vzn_10001_maximize":
                data = {
                    "eventId": "400215",
                    "data": {
                        "f": {
                            "o": {
                                "c201": getStepNameByModule(),
                                "id": inviteAppConfigs.uiType
                            }
                        }
                    }
                };
                WOWPx.track(data, function () {});
                break;
            case "vzn_plan_click":
                var planUrl = "";
                var packages_BundlePkg1_NonJacks = parent.document.getElementById("packages_BundlePkg1_NonJacks");
                if (typeof (packages_BundlePkg1_NonJacks) != "undefined" && packages_BundlePkg1_NonJacks != null) {
                    for (i = 0; i < packages_BundlePkg1_NonJacks.children.length; i++) {
                        if (packages_BundlePkg1_NonJacks.children[i].style.display != "none") {
                            var lnkbtn = packages_BundlePkg1_NonJacks.children[i].getElementsByTagName('a')[1];
                            planUrl = lnkbtn.getAttribute("href").replace(/javascript:/g, 'javascript:parent.');
                            break;
                        }
                    }
                }
                if (planUrl != null) {
                    eval(planUrl);
                    setTimeout(function () {
                        var Popup = window.open('', 'Popup', '');
                        Popup.focus();
                    }, 1000);
                    //url.split('openPopup\(')[1].split(',')[0].replace(/'/g,"");               
                }
                data = {
                    "eventId": "400204",
                    "data": {
                        "f": {
                            "o": {
                                "c204": planUrl,
                                "id": inviteAppConfigs.uiType
                            }
                        }
                    }
                };
                WOWPx.track(data, function () {});
                break;
            case "vzn_channel_click":
                var channelUrl = null;
                var packages_BundlePkg1_NonJacks = parent.document.getElementById("packages_BundlePkg1_NonJacks");
                if (typeof (packages_BundlePkg1_NonJacks) != "undefined" && packages_BundlePkg1_NonJacks != null) {
                    for (i = 0; i < packages_BundlePkg1_NonJacks.children.length; i++) {
                        if (packages_BundlePkg1_NonJacks.children[i].style.display != "none") {
                            var lnkbtn = packages_BundlePkg1_NonJacks.children[i].getElementsByTagName('a')[0];
                            channelUrl = lnkbtn.getAttribute("href").replace(/javascript:/g, 'javascript:parent.');
                            break;
                        }
                    }
                }
                if (channelUrl != null) {
                    eval(channelUrl);
                    setTimeout(function () {
                        var Popup = window.open('', 'Popup', '');
                        Popup.focus();
                    }, 1000);
                }
                data = {
                    "eventId": "400205",
                    "data": {
                        "f": {
                            "o": {
                                "c204": channelUrl,
                                "id": inviteAppConfigs.uiType
                            }
                        }
                    }
                };
                WOWPx.track(data, function () {});
                break;
            case "vzn_chat_click":
                closeVideoTheatre();
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setWidgetShowing(0);
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setSetTopDVRShownStatus("1");
                data = {
                    "eventId": "400213",
                    "data": {
                        "f": {
                            "o": {
                                "c201": getStepNameByModule(),
                                "id": inviteAppConfigs.uiType
                            }
                        }
                    }
                };
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.chatInviteAccepted("p", customParams["ruleId"], customParams["iId"]);
                WOWPx.track(data, function () {
                    widgetCloseWrapper('widget');
                });
                break;
            case "vzn_10001_close":
                closeVideoTheatre();
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setWidgetShowing(0);
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setSetTopDVRShownStatus("1");
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setSetTopDVRClosedTime();
                data = {
                    "eventId": "400202",
                    "data": {
                        "f": {
                            "v": {
                                "ri": customParams["ruleId"]
                            },
                            "c": {
                                "c01": (pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)?pxoeWin.SN.CustomScript.captureCartId():""
                            },
                            "o": {
                                "c201": getStepNameByModule(),
                                "id": inviteAppConfigs.uiType
                            }
                        }
                    }
                };
                WOWPx.track(data, function () {
                    widgetCloseWrapper('widget');
                });
                break;
            case "vzn_10001_close_minimized":
                closeVideoTheatre();
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setWidgetShowing(0);
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setSetTopDVRShownStatus("1");
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setSetTopDVRClosedTime();
                data = {
                    "eventId": "400202",
                    "data": {
                        "f": {
                            "v": {
                                "ri": customParams["ruleId"]
                            },
                            "c": {
                                "c01": (pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)?pxoeWin.SN.CustomScript.captureCartId():""
                            },
                            "o": {
                                "c201": "Minimize Close",
                                "id": inviteAppConfigs.uiType
                            }
                        }
                    }
                };
                WOWPx.track(data, function () {
                    widgetCloseWrapper('tab');
                });
                break;
            case "vzn_10001_close_ignore_timeout":
                closeVideoTheatre();
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setWidgetShowing(0);
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setSetTopDVRShownStatus("1");
                if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setSetTopDVRClosedTime();
                data = {
                    "eventId": "400202",
                    "data": {
                        "f": {
                            "v": {
                                "ri": customParams["ruleId"]
                            },
                            "c": {
                                "c01": (pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)?pxoeWin.SN.CustomScript.captureCartId():""
                            },
                            "o": {
                                "c201": "Ignore close",
                                "id": inviteAppConfigs.uiType
                            }
                        }
                    }
                };
                WOWPx.track(data, function () {
                    widgetCloseWrapper('tab');
                });
                break;
            case "vzn_10001_slider":
                data = {
                    "eventId": "400216",
                    "data": {
                        "f": {
                            "o": {
                                "c201": getStepNameByModule(),
                                "id": inviteAppConfigs.uiType
                            }
                        }
                    }
                };
                WOWPx.track(data, function () {});
                var el = document.getElementById('display-panel');
                if (window.sliderShown) {
                    /* close it and mark it*/
                    SN.WOWPx.Effects.doSlideOut(el, 304, 0, 1000, function () {
                        el = document.getElementById('vzn_10003_main_slider_left')
                        el.style.backgroundPosition = "-199px -47px";
                        el = document.getElementById('vzn_10003_main_slider_right')
                        el.style.backgroundPosition = "-199px -47px";
                        window.sliderShown = false;
                    });
                    
                    //Site Catalyst tracking
                    scTrackingCall();
                    //End of Site Catalyst tracking
                } else {
                    /* mark it and open it */
                    SN.WOWPx.Effects.doSlideIn(el, 0, 304, 1000, function () {
                        window.sliderShown = true;
                        el = document.getElementById('vzn_10003_main_slider_left')
                        el.style.backgroundPosition = "-230px -47px";
                        el = document.getElementById('vzn_10003_main_slider_right')
                        el.style.backgroundPosition = "-230px -47px";
                    });
                    
                    //Site Catalyst tracking
                    scTracking('2a');
                    //End of Site Catalyst tracking
                }
                break;
            case "vzn_10001_close_slider":
                if (window.sliderShown) {
                    /* close it and mark it*/
                    var el = document.getElementById('display-panel');
                    if (!SN.Utils.undefinedOrNull(el)) {
                        if (el.scrollTop != 0) {
                            el.scrollTop = 0;
                            el = document.getElementById('vzn_10003_main_slider_left')
                            if (!SN.Utils.undefinedOrNull(el)) {
                                el.style.backgroundPosition = "-199px -47px";
                                el = document.getElementById('vzn_10003_main_slider_right')
                                el.style.backgroundPosition = "-199px -47px";
                            }
                        }
                        window.sliderShown = false;
                    }
                }
                break;
            default:
                /*Take a */ break; /* take a kitkat */
        }
    }

    function widgetCloseWrapper(src) {
        var el = WOWPx.getMyWoWPxRef()[src];
        SN.WOWPx.Effects.doFadeOut(el, 100, 0, 1000, function () {
            WOWPx.close();
        });
    }

    function handleWidgetAction(action) {
        var tm = new Date().getTime();
        if (tm - lastactionmap[action] < 500) {
            SN.Logger.consoleLog("repeated handleWidgetAction(action):", action);
            return false;
        }
        var data = null;
        var type = null;
        SN.Logger.consoleLog("handleWidgetAction(action):", action);
        type = action;
        lastactionmap[action] = tm;

        if (window.slider.isOpen() == true) {
            window.slider.close(function () {
                handleAppInteractionEvent({
                    "type": type
                });
            });
        } else {
            handleAppInteractionEvent({
                "type": type
            });
        }
    }

    function startIgnoreTimeout() {
        ignoreTimeoutId = window.setTimeout(function () {
            SN.WOWPx.Controller.handleWidgetAction('vzn_10001_close_ignore_timeout');
        }, inviteAppConfigs.ignoreTimeout);
    }

    function deregisterIgnoreTimeout() {
        window.clearTimeout(ignoreTimeoutId);
    }

    function populateYoutubeVideoData() {
        var ytVideos = ['R1cUnAnwmq0', 'ynGTr4ARd3Y', 'WDpi85juQAk'];
        for (var i = 0; i < ytVideos.length; i++) {
            window.ytData[ytVideos[i]] = {};
            window.ytData[ytVideos[i]]['title'] = '';
            window.ytData[ytVideos[i]]['desc'] = '';
            var scriptEl = document.createElement('script');
            scriptEl.src = location.protocol + "//gdata.youtube.com/feeds/api/videos/" + ytVideos[i] + "?v=2&alt=json-in-script&callback=SN.WOWPx.Controller.populateYoutubeVideoDataCallback";
            document.getElementsByTagName('head')[0].appendChild(scriptEl);
        }
    }

    function populateYoutubeVideoDataCallback(data) {
        if (data && data.entry && data.entry.id && data.entry.title && data.entry.media$group) {
            var videoId = data.entry.id.$t.substr(data.entry.id.$t.lastIndexOf(":") + 1);
            window.ytData[videoId]['title'] = data.entry.title.$t;
            window.ytData[videoId]['desc'] = data.entry.media$group.media$description.$t;
        }
    }

    return {
        handleWidgetAction: handleWidgetAction,
        setStore: function () {
            return datastore;
        },
        startIgnoreTimeout: startIgnoreTimeout,
        deregisterIgnoreTimeout: deregisterIgnoreTimeout,
        widgetCloseWrapper: widgetCloseWrapper,
        populateYoutubeVideoData: populateYoutubeVideoData,
        populateYoutubeVideoDataCallback: populateYoutubeVideoDataCallback
    };
})();

function addVideoTheatre(productName) {
    var data = {};
    var videoURL = null;
    
    //Site Catalyst tracking
    scTracking('5');
    //End of Site Catalyst tracking
    
    if (productName == "dvr_video") {
        videoURL = "R1cUnAnwmq0";
        data = {
            "eventId": "400209",
            "data": {
                "f": {
                    "o": {
                        "c201": getStepNameByModule(),
                        "c202": window.ytData[videoURL]['title'],
                        "id": inviteAppConfigs.uiType
                    }
                }
            }
        };
        WOWPx.track(data, function () {});
    } else if (productName == "setTop_video") {
        videoURL = "ynGTr4ARd3Y";
        data = {
            "eventId": "400209",
            "data": {
                "f": {
                    "o": {
                        "c201": getStepNameByModule(),
                        "c202": window.ytData[videoURL]['title'],
                        "id": inviteAppConfigs.uiType
                    }
                }
            }
        };
        WOWPx.track(data, function () {});
    } else if (productName == "tvOutlet_video") {
        videoURL = "WDpi85juQAk";
        data = {
            "eventId": "400212",
            "data": {
                "f": {
                    "o": {
                        "c201": getStepNameByModule(),
                        "c202": window.ytData[videoURL]['title'],
                        "id": inviteAppConfigs.uiType
                    }
                }
            }
        };
        WOWPx.track(data, function () {});
    }

    var displayPanel = document.getElementById("display-panel");

    var theatreDiv = document.createElement("div");
    theatreDiv.id = "theatreDiv";

    var theatreDivContent = document.createElement("div");
    theatreDivContent.id = "theatreDivContent";
    theatreDivContent.innerHTML = Jaml.render('theatre-content', {
        'id': videoURL,
        'title': ytData[videoURL]['title'],
        'desc': ytData[videoURL]['desc']
    });

    displayPanel.insertBefore(theatreDivContent, displayPanel.firstChild);
    displayPanel.insertBefore(theatreDiv, displayPanel.firstChild);
    var divDemoVideoEl = document.getElementById("divDemoVideo");
    divDemoVideoEl.innerHTML = "<object width='281' height='169'>\
        <param name='movie' value='"+location.protocol+"//www.youtube.com/v/" + videoURL + "?showinfo=0&version=3'></param>\
        <param name='allowFullScreen' value='true'></param>\
        <param name='allowScriptAccess' value='false'></param>\
        <param name='showinfo' value=0></param>\
        <embed src='"+location.protocol+"//www.youtube.com/v/" + videoURL + "?showinfo=0&version=3' type='application/x-shockwave-flash' showinfo=0 allowfullscreen='true' allowScriptAccess='false' width='281' height='169'></embed>\
    </object>";
}

function removeVideoTheatre() {
    //Site Catalyst tracking
    scTrackingCall();    
    //End of Site Catalyst tracking
    
    window.setTimeout(function () {
        var displayPanel = document.getElementById("display-panel");
        var theatreDiv = document.getElementById("theatreDiv");
        var theatreDivContent = document.getElementById("theatreDivContent");
        displayPanel.removeChild(theatreDivContent);
        displayPanel.removeChild(theatreDiv);
    }, 200);
    data = {
        "eventId": "400210",
        "data": {
            "f": {
                "o": {
                    "id": inviteAppConfigs.uiType
                }
            }
        }
    };
    WOWPx.track(data, function () {});
}

function closeVideoTheatre() {
    window.setTimeout(function () {
        var displayPanel = document.getElementById("display-panel");
        var theatreDiv = document.getElementById("theatreDiv");
        if (!SN.Utils.undefinedOrNull(theatreDiv)) {
            var theatreDivContent = document.getElementById("theatreDivContent");
            displayPanel.removeChild(theatreDivContent);
            displayPanel.removeChild(theatreDiv);
        }
    }, 200);
    if (parent.jQuery) {
        parent.jQuery(parent.window).unbind('.wowpx247');
        parent.jQuery(parent).unbind('.wowpx247');
        parent.jQuery('.radio').unbind('.wowpx247');
        parent.jQuery("[href='javascript:PostStartover();']").unbind('.wowpx247');
        parent.jQuery("#button_add_tv").unbind(".wowpx247");
        parent.jQuery('#sn_aimsChatIcon').unbind(".wowpx247");
        parent.jQuery("#clearEqupSelection").unbind(".wowpx247");
        parent.jQuery("#button_add_tv").unbind(".wowpx247");
        parent.jQuery("#proceedflow").unbind(".wowpx247");
        parent.jQuery("a[href='javascript:validateSelection(\'D\');_hbLink(\'choose_equip_from_list\');']").unbind(".wowpx247");
        parent.jQuery("a[href='javascript:validateSelection(\'R\');_hbLink(\'equipment_advisor\');']").unbind(".wowpx247");
    }
}

function addModuleDynamicContent() {
    switch (moduleShowing) {
        case "tv-section":
            document.getElementById("lblTVPlanName").innerHTML = objStore.get("tvPlanName");
            parent.jQuery(parent.window).unbind('scrollstop.wowpx247');
            parent.jQuery(parent.window).bind('scrollstop.wowpx247', function (e) {
                isScrolledIntoView('#FTVEquipments_EA');
            });
            data = {
                "eventId": "400203",
                "data": {
                    "f": {
                        "o": {
                            "id": inviteAppConfigs.uiType
                        }
                    }
                }
            };
            WOWPx.track(data, function () {});
            break;
        case "equip-section":
            parent.jQuery(parent.window).unbind('scrollstop.wowpx247');
            parent.jQuery(parent.window).bind('scrollstop.wowpx247', function (e) {
                isScrolledIntoView('#FTVEquipments_EA');
            });
            data = {
                "eventId": "400206",
                "data": {
                    "f": {
                        "o": {
                            "id": inviteAppConfigs.uiType
                        }
                    }
                }
            };
            WOWPx.track(data, function () {});
            break;
        case "pick-equip-yes":
            AddHwSelectionHandlerStart();
            if (qty == 0) {
                qty = !isNaN(parseInt((pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)?pxoeWin.SN.CustomScript.getFIOSTVEquipmentRequiredQty():0));
            }
            document.getElementById("noOfTvs").innerHTML = qty;
            if (qty > 1) {
                document.getElementById("noOfSetTopBox1").innerHTML = "& " + (qty - 1) + ((qty == 2) ? " Set Top Box" : " Set Top Boxes");
                document.getElementById("noOfSetTopBox2").innerHTML = "& " + (qty - 1) + ((qty == 2) ? " Set Top Box" : " Set Top Boxes");
                document.getElementById("divSetTopBox1").style.display = "block";
                document.getElementById("vzn_accordionbox_accordion2_header").style.display = "block";
                document.getElementById("vzn_accordionbox_accordion2_content").style.display = "none";
            } else {
                document.getElementById("divSetTopBox1").style.display = "none";
                document.getElementById("vzn_accordionbox_accordion2_header").style.display = "none";
                document.getElementById("vzn_accordionbox_accordion2_content").style.display = "none";
            }
            parent.jQuery(parent.window).unbind('scrollstop.wowpx247');
            data = {
                "eventId": "400207",
                "data": {
                    "f": {
                        "o": {
                            "id": inviteAppConfigs.uiType
                        }
                    }
                }
            };
            WOWPx.track(data, function () {});
            break;
        case "pick-equip-no":
            AddHwSelectionHandlerStart();
            if (qty == 0) {
                qty = !isNaN(parseInt((pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)?pxoeWin.SN.CustomScript.getFIOSTVEquipmentRequiredQty():0));
            }
            document.getElementById("noOfTvs").innerHTML = qty;
            document.getElementById("noOfSetTopBox1").innerHTML = qty + ((qty == 1) ? " Set Top Box" : " Set Top Boxes");
            parent.jQuery(parent.window).unbind('scrollstop.wowpx247');
            data = {
                "eventId": "400208",
                "data": {
                    "f": {
                        "o": {
                            "id": inviteAppConfigs.uiType
                        }
                    }
                }
            };
            WOWPx.track(data, function () {});
            break;
        case "letus-pick":
            AddHwSelectionHandlerStart();
            parent.jQuery(parent.window).unbind('scrollstop.wowpx247');
            data = {
                "eventId": "400211",
                "data": {
                    "f": {
                        "o": {
                            "id": inviteAppConfigs.uiType
                        }
                    }
                }
            };
            WOWPx.track(data, function () {});
            break;
        case "mrdvr-free":
            parent.jQuery(parent.window).unbind('scrollstop.wowpx247');
            data = {
                "eventId": "400217",
                "data": {
                    "f": {
                        "o": {
                            "id": inviteAppConfigs.uiType
                        }
                    }
                }
            };
            WOWPx.track(data, function () {});
            break;
        default:
            /*Take a */
            break; /* take a kitkat */
    }
}

Jaml.register('widget', function() {
    div({id: 'widget'},
        div({id: "main-widget", cls: "rounded"},
            div ({id: "widget-container"},
                div({id: "header"},
                    div({id: "header-logo"},"")
                ),
                div({id: "widget-container-main"},
                    div({id:"display-panel"}, null)
                ),
                div({id:"setTopWidget-footer"},
                    div({id:"footer-text"},"" 
                    )
                )
            ),
            div ({id:"widget-controls"},
                div({id:"close", onclick:"SN.WOWPx.Controller.handleWidgetAction('vzn_10001_close')"}, div({id: "closeBtn"},""))
            ),
            div({id:"slider-panel-container"},
                div({id:"slide-out-button", cls:"rounded"},
                    div({id:"slide-out-logo"}, null)
                ),
                div({id:"slider-panel-header", cls:"grey_gradient"},
                    div({id:"slider-panel-header-text", cls:"moduleheader"}, null)
                ),
                div({id:"slider-panel"}, null)
            )
        )        
    );
});

Jaml.register('displaypanel-chat', function() {
    div({id:"displaypanel-chat-container"},
        div({id:"displaypanel-chat-button", onclick:"SN.WOWPx.Controller.handleWidgetAction('vzn_chat_click')"},
            div({id:"displaypanel-chat-button-image"},null),
            p({id:"displaypanel-chat-button-text"},                             
                span({cls:"medium"}," Have questions?"),
                span({cls:"heavy"}, " Chat Now! ")
            )
        )
    )
});


Jaml.register('tv-section', function() {
    div({id:"display-panel-module-content", cls:"stepContainer"},
        div({id:"vzn_10003_main"},                    
            div({id:"vzn_heading"},
                div({cls:"heading"},"")
            ),
            div({id:"vzn_heading_img"},
               div({cls: "header_tv_img"},null)
            ),            
            div({cls:"vzn_introbox"},
                div({cls:"txt-medium"}, "Hi, you have selected", 
                    span({id:"lblTVPlanName"}," "),
                    "Plan as part of FiOS Bundle.",
                    span({cls: "infoBtn", onclick:"SN.WOWPx.Controller.handleWidgetAction('vzn_plan_click')"}, '&nbsp;&nbsp;&nbsp;')
                )               
            ),
            div({cls:"vzn_introbox"},
                div({cls:"heading"},"Add TV Channels:")
            ),
            div({cls:"vzn_introbox"},                
                div({cls:"txt-small"},
                    "This is an optional section. If you wish to subscribe to channels not covered in your plan, you can choose them here. To view channels covered in your plan,",
                    span({id:"lnkTvChannel", cls:'txt-link', onclick:"SN.WOWPx.Controller.handleWidgetAction('vzn_channel_click')"},"click here.")
                )               
            )           
        )
    );
});

Jaml.register('equip-section', function() {
    div({id:"display-panel-module-content", cls:"stepContainer"},
        div({id:"vzn_10003_main"},                    
            div({id:"vzn_heading"},
                div({cls:"heading"},"Pick your FiOS TV Equipment")
            ),          
            div({cls:"vzn_introbox"},                
                div({cls:"txt-medium"},"This section is for selecting the hardware required to connect your TV to FiOS network.")                               
            ),
            
            div({cls:"bullet"},             
                div({cls: "numberBullet1"},null),
                div({cls:"txt-bullet"},"Select the number of TVs you want to connect to FiOS service.")                             
            ),
            
            div({cls:"bullet"},             
                div({cls: "numberBullet2"},null),
                div({cls:"txt-bullet"},"If you wish to record shows & movies, select the checkbox.")                                
            ),
            
            div({cls:"vzn_introbox"},                
                div({cls:"txt-medium"},"Once done, you have 2 options:")                                
            ),          
            div({cls:"bullet"},             
                div({cls: "numberBullet1"},null),
                div({cls:"txt-bullet"},"To let Verizon pick the best equipment to match your needs, click \"Let us pick for you.\"")                                
            ),          
            div({cls:"bullet"},             
                div({cls: "numberBullet2"},null),
                div({cls:"txt-bullet"},"If you want to pick the equipment yourself, click \"Pick Equipment\" button.")                              
            ),
            div({id:"vzn_10003_main_slider"},
                div({id:"vzn_10003_main_slider_header", onclick:"SN.WOWPx.Controller.handleWidgetAction('vzn_10001_slider')"},
                    div({id:"vzn_10003_main_slider_left", cls:"slider_open"}, null),
                    div({id:"vzn_10003_main_slider_center"},
                        span({style:"color: #b00d00;"}, "Click here"),
                        span("for help on Equipment")
                    ),
                    div({id:"vzn_10003_main_slider_right", cls:"slider_open"}, null)
                ),
                div({id:"vzn_10003_main_slider_content"},
                     ol({style:"padding: 0px 10px 0px 20px;"},
                        li({style:"padding-bottom: 10px;"}, "You need 1 piece of equipment per TV: Exception:if your TV comes equipped with a QAM tuner, you can use that. Otherwise you need to pick from the list."),
                        li({style:"padding-bottom: 10px;"}, "If you want to record shows and movies, you should choose a DVR or Multi-Room DVR."),
                        li({style:"padding-bottom: 10px;"}, "If you want to view those shows on any TV - Choose a Multi-Room DVR."),
                        li({style:"padding-bottom: 10px;"}, "Other equipment alternatives like Basic Digital Adapters and Cable Cards are available with limited functions."),
                        li({style:"padding-bottom: 10px;"}, "Order counts! Choose your Multi-room DVR or DVR first, then select the other equipment - it is easier.")
                    )
                )
            )
        )
    );
});

Jaml.register('pick-equip-yes', function() {
    div({id:"display-panel-module-content", cls:"stepContainer"},
        div({id:"vzn_10003_main"},                    
            div({id:"vzn_heading"},
                div({cls:"heading"},"You had selected:")
            ),
            div({cls:"vzn_introbox"},
                div({cls:"txt-select"},"Number of TVs to be connected: ",span({id:"noOfTvs"}, "2")),                
                div({cls:"txt-select"},"Record Shows & Movies: ",span({id:"isRecordShows"}, "Yes"))             
            ),
            div({cls:"vzn_introbox"},
                div({cls:"txt-small"}, "Based on your selection, we recommend the following (click for details):")
            ),
            div({id:"vzn_accordionbox"},
                div({id:"vzn_accordionbox_accordion1_header", cls:"accordion_heading"},
                    div({cls:"accordion_heading_text"}, "1 DVR ", span({id:"noOfSetTopBox1"},""),
                        div({cls:"accordion_heading_text_arrow"},"")
                    )
                ),
                div({id:"vzn_accordionbox_accordion1_content", style:"height:0px; display:none;"},
                    div({cls:"accordion_child"},
                        div( {cls:"dvr-thumb", style:"height:65px;"}
                            ,a({href:"javascript:void(0)", id:"accordion_child-record-shows-video1",cls:"accordion_child-img1",onclick:"addVideoTheatre('dvr_video')"},"")
                            ,span({cls:"accordion_child-text"},"DVR is required to be able to record movies & shows. Supports recording from the 1 TV it is connected to.") 
                        ),
                        div( {id:"divSetTopBox1", cls:"dvr-thumb", style:"height:50px;"}
                            ,a({href:"javascript:void(0)", id:"accordion_child-record-shows-video2",cls:"accordion_child-img1",onclick:"addVideoTheatre('setTop_video')"},"")
                            ,span({cls:"accordion_child-text"},"Set Top box is required to connect additional TV to FiOS")  
                        )   
                    )
                ),
                div({id:"vzn_accordionbox_accordion2_header", cls:"accordion_heading"},
                    div({cls:"accordion_heading_text"}, "1 Multi-Room DVR ", span({id:"noOfSetTopBox2"},""),
                        div({cls:"accordion_heading_text_arrow"},"")
                    )
                ),
                div({id:"vzn_accordionbox_accordion2_content", style:"height:0px; display:none;"},
                    div({cls:"accordion_child"},
                        div( {cls:"dvr-thumb", style:"height:50px;"}
                            ,a({href:"javascript:void(0)", id:"accordion_child-record-shows-video3",cls:"accordion_child-img2",onclick:"addVideoTheatre('dvr_video')"},"")
                            ,span({cls:"accordion_child-text"},"Multi-Room DVR is required to be able to start recording from multiple TVs.")   
                        ),
                        div( {cls:"dvr-thumb", style:"height:50px;"}
                            ,a({href:"javascript:void(0)", id:"accordion_child-record-shows-video4",cls:"accordion_child-img2",onclick:"addVideoTheatre('setTop_video')"},"")
                            ,span({cls:"accordion_child-text"},"Set Top box is required to connect additional TV to FiOS")  
                        )   
                    )   
                )
            )
        ),
        div({id:"vzn_10003_main_slider"},
            div({id:"vzn_10003_main_slider_header", onclick:"SN.WOWPx.Controller.handleWidgetAction('vzn_10001_slider')"},
                div({id:"vzn_10003_main_slider_left", cls:"slider_open"}, null),
                div({id:"vzn_10003_main_slider_center"},
                    span({style:"color: #b00d00;"}, "Click here"),
                    span("for help on Equipment")
                ),
                div({id:"vzn_10003_main_slider_right", cls:"slider_open"}, null)
            ),
            div({id:"vzn_10003_main_slider_content"},
                ol({style:"padding: 0px 10px 0px 20px;"},
                    li({style:"padding-bottom: 10px;"}, "You need 1 piece of equipment per TV: Exception:if your TV comes equipped with a QAM tuner, you can use that. Otherwise you need to pick from the list."),
                    li({style:"padding-bottom: 10px;"}, "If you want to record shows and movies, you should choose a DVR or Multi-Room DVR."),
                    li({style:"padding-bottom: 10px;"}, "If you want to view those shows on any TV - Choose a Multi-Room DVR."),
                    li({style:"padding-bottom: 10px;"}, "Other equipment alternatives like Basic Digital Adapters and Cable Cards are available with limited functions."),
                    li({style:"padding-bottom: 10px;"}, "Order counts! Choose your Multi-room DVR or DVR first, then select the other equipment - it is easier.")
                )
            )
        )
    );
});

Jaml.register('pick-equip-no', function() {
    div({id:"display-panel-module-content", cls:"stepContainer"},
        div({id:"vzn_10003_main"},                    
            div({id:"vzn_heading"},
                div({cls:"heading"},"You had selected:")
            ),
            div({cls:"vzn_introbox"},
                div({cls:"txt-select"},"Number of TVs to be connected: ",span({id:"noOfTvs"}, "2")),                
                div({cls:"txt-select"},"Record Shows & Movies: ",span({id:"isRecordShows"}, "No"))              
            ),
            div({cls:"vzn_introbox"},
                div({cls:"txt-small"}, "Based on your selection, we recommend the following (click for details):")
            ),
            div({id:"vzn_accordionbox"},
                div({id:"vzn_accordionbox_accordion1_header", cls:"accordion_heading"},
                    div({cls:"accordion_heading_text"}, span({id:"noOfSetTopBox1"}, null),
                        div({cls:"accordion_heading_text_arrow"},"")
                    )
                ),
                div({id:"vzn_accordionbox_accordion1_content", style:"height:0px; display:none;"},
                    div({cls:"accordion_child"},
                        div( {cls:"dvr-thumb", style:"height:50px;"}
                            ,a({href:"javascript:void(0)", id:"accordion_child-dont-record-shows-video1",cls:"accordion_child-img1",onclick:"addVideoTheatre('setTop_video')"},"")
                            ,span({cls:"accordion_child-text"},"Set Top box is required to connect TV to FiOS network.") 
                        )
                    )
                )                   
            )
        ),
        div({id:"vzn_10003_main_slider"},
            div({id:"vzn_10003_main_slider_header", onclick:"SN.WOWPx.Controller.handleWidgetAction('vzn_10001_slider')"},
                div({id:"vzn_10003_main_slider_left", cls:"slider_open"}, null),
                div({id:"vzn_10003_main_slider_center"},
                    span({style:"color: #b00d00;"}, "Click here"),
                    span("for help on Equipment")
                ),
                div({id:"vzn_10003_main_slider_right", cls:"slider_open"}, null)
            ),
            div({id:"vzn_10003_main_slider_content"},
                ol({style:"padding: 0px 10px 0px 20px;"},
                    li({style:"padding-bottom: 10px;"}, "You need 1 piece of equipment per TV: Exception:if your TV comes equipped with a QAM tuner, you can use that. Otherwise you need to pick from the list."),
                    li({style:"padding-bottom: 10px;"}, "If you want to record shows and movies, you should choose a DVR or Multi-Room DVR."),
                    li({style:"padding-bottom: 10px;"}, "If you want to view those shows on any TV - Choose a Multi-Room DVR."),
                    li({style:"padding-bottom: 10px;"}, "Other equipment alternatives like Basic Digital Adapters and Cable Cards are available with limited functions."),
                    li({style:"padding-bottom: 10px;"}, "Order counts! Choose your Multi-room DVR or DVR first, then select the other equipment - it is easier.")
                )
            )
        )
    );
});

Jaml.register('letus-pick', function() {
    div({id:"display-panel-module-content", cls:"stepContainer"},
        div({id:"vzn_10003_main"},                    
            div({id:"vzn_heading"},
                div({cls:"heading"},"Well done with your TV equipment selections!")
            ),          
            div({id:"vzn_heading_img"},
                div({cls: "header_img"},null)
            ),
            div({cls:"vzn_introbox"},                
                div({cls:"txt-small"},"Now, If you do not have a TV Outlet in your home already, select the number of TV outlets that you wish to install before continuing.")                              
            ),
            div({cls:"vzn_separator"}, ""),
            div({cls:"vzn_introbox"},                
                div({cls:"txt-small"},
                    span({id:"lnkTvOutlet", cls:'txt-link-medium', onclick:"addVideoTheatre('tvOutlet_video')"},"Click here"),
                    " for help on TV outlet."                   
                )               
            ),              
            div({cls:"vzn_separator"}, ""),
            div({cls:"vzn_introbox"},                
                div({cls:"txt-small"},"You will be charged ", span({id:"lblInsCharge", cls:"txt-small-bold"},"$54.99") ,"for each installation.")                               
            )
        )
    );
});

Jaml.register('theatre-content', function(data) {
    div({cls:'closeHeader'},
        div({cls:'closeBtn', onclick:'removeVideoTheatre()'}, null)
    ),
    div({cls:'demoVideo', id:'divDemoVideo'}, null),
    div({cls:'descVideo'},
        div({cls:'descHeader'}, data.title),
        div({cls:'descText'}, data.desc)
    )
});

Jaml.register('mrdvr-free', function(noOfTv) {
    var plural = false;
    var numTv = !isNaN(parseInt(noOfTv))?parseInt(noOfTv):1;
    if (numTv>1 || numTv===0) {
        plural = true;
    }
    
    div({id:"display-panel-module-content", cls:"stepContainer"},
        div({id:"vzn_10003_main"},                    
            div({id:"vzn_heading"},
                div({cls:"heading"},"Congratulations!")
            ),
            div({id:"vzn_heading_img"},
               div({cls: "header_tv_img"},null)
            ),
            div({cls:"vzn_introbox"},
                div({cls:"txt-small"}, "Let's get your home set up!")               
            ),
            div({cls:"vzn_introbox"},
                div({cls:"txt-small"}, "Each TV in your home will need at least 1 equipment to receive FiOS signals.")               
            ),
            div({cls:"vzn_introbox"},
                div({cls:"txt-small"}, "The offer selected by you comes with "+ noOfTv +" device"+ (plural?"s":"") +". Refer to &quot;Pick Your FiOS TV Equipment&quot; section.")               
            ),
            div({cls:"vzn_introbox"},
                div({cls:"txt-small"}, "If you need devices for more than "+ noOfTv +" television"+ (plural?"s":"") +", select &quot;Add a TV&quot;")               
            )
        )
    );
});

function loadModule(name, params) {
    moduleShowing = name;
        
    objStore.set("module", moduleShowing);
    if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setSetTopDVRShownStatus("1", true);
    if(pxoeWin && pxoeWin.SN && pxoeWin.SN.CustomScript)pxoeWin.SN.CustomScript.setSuppressSetTopDVR(1);
    var moduleContainer = document.getElementById('display-panel');
    var moduleContent = Jaml.render(name, params) + Jaml.render('displaypanel-chat');
    if (moduleContent != null) {
        moduleContainer.innerHTML = moduleContent;
        SN.WOWPx.setupAccordian("vzn_accordionbox");
        SN.WOWPx.Controller.handleWidgetAction('vzn_10001_close_slider');
    }
}

function getStepNameByModule() {
    var stepValue = null;
    switch (moduleShowing) {
        case "tv-section":
            stepValue = "Step 1";
            break;
        case "equip-section":
            stepValue = "Step 2";
            break;
        case "pick-equip-yes":
            stepValue = "Step 3";
            break;
        case "pick-equip-no":
            stepValue = "Step 3b";
            break;
        case "letus-pick":
            stepValue = "Step 4";
            break;
	case "mrdvr-free":
	    stepValue = "Step 5";
	    break;
        default:
            /*Take a */ break; /* take a kitkat */
    }
    return stepValue;
}

if (document && document.body) {
    document.body.innerHTML = Jaml.render('widget');
    window.slider = new SN.WOWPx.SliderPanelControl("slider-panel")
    SN.WOWPx.Controller.populateYoutubeVideoData();
    var wowpxref = WOWPx.getMyWoWPxRef();
    if (wowpxref) {
        wowpxref.minimizer.style.display = "block";
    }
    //loadModule("letus-pick");
} else if (console && typeof console.log == 'function') {
    console.log(Jaml.render('widget'));
}

var fsm = StateMachine.create({
    initial: 'preChat', final: 'exitSurvey',
    events: [
      { name: 'prechatSubmit',  from: 'pick-equip-yes',  to: 'pick-equip-no' },
      { name: 'next',  from: 'pick-equip-no',  to: 'equip-section' },
      { name: 'next',  from: 'equip-section',  to: 'letus-pick' },
      { name: 'next',  from: 'letus-pick',  to: 'mrdvr-free' },
      { name: 'back', from: 'mrdvr-free', to: 'letus-pick'  },
      { name: 'back', from: 'letus-pick', to: 'equip-section'  },
      { name: 'back', from: 'equip-section', to: 'pick-equip-no'  },
      { name: 'back', from: 'pick-equip-no', to: 'pick-equip-yes'  }
    ]
  }); 
  
fsm.