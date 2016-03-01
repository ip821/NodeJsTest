import assert = require('assert');
var appInit = require('../app_modules/appInit');

describe("appInit", () => {

    class Scope {
        $: any;
        jQuery: any;
    };

    it("appInit.initJQuery", () => {
        var window = {document: {}};
        var scope: Scope = { $: undefined, jQuery: undefined };
        
        appInit.initJQuery(window, scope);
        
        assert.notEqual(scope.$, undefined, "scope.$ should be defined");
        assert.notEqual(scope.jQuery, undefined, "scope.$ should be defined");
        
        assert.notEqual($, undefined, "$ should be defined");
        assert.notEqual(jQuery, undefined, "jQuery should be defined");
        assert.notEqual(document, undefined, "document should be defined");
    });

    it("appInit.initXMLHttpRequest", () => {
        var window = {document: {}};
        var scope: Scope = { $: {support:{}, ajaxSettings: {}}, jQuery: undefined };
        appInit.initXMLHttpRequest(scope);
        assert.equal(scope.$.support.cors, true, "'scope.$.support.cors' should be true");
        assert.notEqual(scope.$.ajaxSettings.xhr, undefined, "'scope.$.ajaxSettings.xhr' should be defined");
    });
});
