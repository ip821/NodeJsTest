import assert = require('assert');
var init = require('../app_modules/init');

describe("init", () => {

    class Scope {
        $: any;
        jQuery: any;
    };

    it("init.initJQuery", () => {
        var window = {document: {}};
        var scope: Scope = { $: undefined, jQuery: undefined };
        
        init.initJQuery(window, scope);
        
        assert.notEqual(scope.$, undefined, "scope.$ should be defined");
        assert.notEqual(scope.jQuery, undefined, "scope.$ should be defined");
        
        assert.notEqual($, undefined, "$ should be defined");
        assert.notEqual(jQuery, undefined, "jQuery should be defined");
        assert.notEqual(document, undefined, "document should be defined");
    });

    it("init.initXMLHttpRequest", () => {
        var window = {document: {}};
        var scope: Scope = { $: {support:{}, ajaxSettings: {}}, jQuery: undefined };
        init.initXMLHttpRequest(scope);
        assert.equal(scope.$.support.cors, true, "'scope.$.support.cors' should be true");
        assert.notEqual(scope.$.ajaxSettings.xhr, undefined, "'scope.$.ajaxSettings.xhr' should be defined");
    });
});
