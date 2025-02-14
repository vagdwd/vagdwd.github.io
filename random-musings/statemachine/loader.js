var ResourceLoader = (function () {
    var resourceMap = {};

    var loadScript = function (id, dependencies, url) {
        logConsole(id + ' loadscript called');
        resourceMap[id] = 0;
        if (dependencies && dependencies != null) {
            for (var i = 0; i < dependencies.length; i++) {
                if (resourceMap[dependencies[i]] == 0) {
                    setTimeout(function(){
                        loadScript(id, dependencies, url);
                    }, 50);
                    return;
                }
            };
        }
        logConsole(id + ' adding script tag');
        var script   = document.createElement('script');
        script.id = id;
        script.async = true;
        script.src   = url;
        script.type  = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = script.onreadystatechange = function() {
            if(!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                resourceMap[id] = 1;
                logConsole(id + "loaded");
            }
        };
    };

    var logConsole = function (msg) {
        //console.log("[" + new Date().getTime() + "] : " + msg);
    }

    var loadCss = function (id, url) {
        logConsole(id + ' loadcss called');
        logConsole(id + ' adding script tag');
        var cssElement = document.createElement("link");
        cssElement.id = id;
        cssElement.href = url;
        cssElement.rel = "stylesheet";
        cssElement.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(cssElement);
        resourceMap[id] = 0;
        checkCSSLoad(cssElement);
    }

    var checkCSSLoad = function (cssStylesheet) {
        var cssLoaded = 0;
        try {
            if (cssStylesheet.sheet && cssStylesheet.sheet.cssRules.length > 0 )
                cssLoaded = 1;
            else if ( cssStylesheet.styleSheet && cssStylesheet.styleSheet.cssText.length > 0 )
                cssLoaded = 1;
            else if ( cssStylesheet.innerHTML && cssStylesheet.innerHTML.length > 0 )
                cssLoaded = 1;
            }
        catch(ex){ }

        if(cssLoaded) {
            resourceMap[cssStylesheet.id] = 1;
            logConsole(cssStylesheet.id + ' loaded');
        } else {
            setTimeout(function() {
                checkCSSLoad(cssStylesheet);
            }, 50)
        }
    }

    return {
        loadScript : loadScript,
        loadCss : loadCss
    }

}());

ResourceLoader.loadScript('statemachinejs', null, '/tutorials/statemachine/statemachine.js');
ResourceLoader.loadScript('wowpxjs', null, '/tutorials/statemachine/wowpx.js');
ResourceLoader.loadCss('resetcss', '/tutorials/statemachine/css/reset.css');
ResourceLoader.loadCss('widgetcss', '/tutorials/statemachine/css/widget.css');
ResourceLoader.loadScript('controllerjs', ['statemachinejs','wowpxjs', 'resetcss', 'widgetcss'], '/tutorials/statemachine/controller.js');