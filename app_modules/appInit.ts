declare var $;
declare var jQuery;
declare var document;
declare var XMLHttpRequest;

export function initJQuery(window: any, scope: any) {
    scope.$ = require("jquery");
    scope.jQuery = scope.$;

    $ = scope.$;
    jQuery = scope.$;
    document = window.document;
}

export function initXMLHttpRequest(scope) {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

    scope.$.support.cors = true;
    scope.$.ajaxSettings.xhr = function() {
        return new XMLHttpRequest();
    };
}
