/**
 *  @identity customdecisionserver
 *
 **/

if(!SN) {
    var SN = {};
}

SN.CustomDecisionServer = (function() {
    var params = null;
    var decision = null;
    var cdnVersion = null;
    var pspVersion = null;
    var CONST_BY_PASSED = 'b';
    var CONST_ACTIVE = 'a';
    var CONST_VICOOKIE_NAME = "sn.vi";
    var CONST_DSCOOKIE_NAME = "sn.ds";

    function undefinedOrNull(value) {
        return (value == null || typeof value == "undefined" || typeof value == null);
    }

    SN.Store = (function() {
        var store = window.localStorage;
        var rootKey = null;
        
        function key(key, rootKey) {
            if(undefinedOrNull(rootKey)){
                return encodeURIComponent(key);                   
            }
            return encodeURIComponent(rootKey) + encodeURIComponent(key);
        }

        function set (key, value) {
            if (undefinedOrNull(store)) {
                return null;
            }
            if (undefinedOrNull(rootKey)) {
                return store.setItem(key, value);                    
            }
            return store.setItem(key(rootKey, key), value);
        }

        function get (key) {
            if (undefinedOrNull(store)) {
                return null;
            }
            if (undefinedOrNull(rootKey)) {
                return store.getItem(key);                    
            }
            return store.getItem(key(rootKey, key));
        }
        var me = {
            get : get,
            set : set
        };
        return me;
    })();

    function init(p) {
        params = p;
    }

    function getDecision() {
        var localDateObj = new Date();
        var time  = localDateObj.getHours() * 100 + localDateObj.getHours();
        var snCookieValue = SN.Store.get(CONST_VICOOKIE_NAME);
        if (time > params.start && time < params.stop) {
            decision = CONST_ACTIVE;
            pspVersion = SN.Conf.CONST_PSP_VERSION;
            cdnVersion = SN.Conf.CONST_CDN_VERSION;
        } else if (!undefinedOrNull(snCookieValue)) {
            decision = CONST_ACTIVE;
            pspVersion = SN.Conf.CONST_PSP_VERSION;
            cdnVersion = SN.Conf.CONST_CDN_VERSION;
        } else {
            var decisionCookieValue = SN.Store.get(CONST_DSCOOKIE_NAME);
            if (!undefinedOrNull(decisionCookieValue)) {
                decision = decisionCookieValue;
            } else {
                var rand = parseInt(Math.random().toString().substring(2, 4));
                if (rand < SN.Conf.BYPASS_PERCENTAGE) {
                    decision = CONST_BY_PASSED;
                } else {
                    decision = CONST_ACTIVE;
                }
            }
        }
        SN.Store.set(CONST_DSCOOKIE_NAME, decision);

        if (decision == CONST_ACTIVE) {
            pspVersion = SN.Conf.CONST_PSP_VERSION;
            cdnVersion = SN.Conf.CONST_CDN_VERSION;
        }
        return {
            decision : decision,
            pspVersion : pspVersion,
            cdnVersion : cdnVersion
        }
    }
    var me = {
        init : init,
        getDecision : getDecision
    }
    return me;
})();