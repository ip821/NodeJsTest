    function initJQuery(scope) {
        scope.$ = require("jquery");
        global.jQuery = scope.$;
        global.document = scope.window.document;
    }

    function initXMLHttpRequest(scope) {
        XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

        scope.$.support.cors = true;
        scope.$.ajaxSettings.xhr = function() {
            return new XMLHttpRequest();
        };
    }

exports.initJQuery = initJQuery;
exports.initXMLHttpRequest = initXMLHttpRequest;
