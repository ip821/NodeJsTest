function initJQuery(window, scope) {
    scope.$ = require("jquery");
    scope.jQuery = scope.$;

    $ = scope.$;
    jQuery = scope.$;
    document = window.document;
}

function initXMLHttpRequest(scope) {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

    scope.$.support.cors = true;
    scope.$.ajaxSettings.xhr = function () {
        return new XMLHttpRequest();
    };
}

exports.initJQuery = initJQuery;
exports.initXMLHttpRequest = initXMLHttpRequest;