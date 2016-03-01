import assert = require('assert');
import appProxy = require("../app_modules/appProxy");

describe("appProxy", () => {

    class ProxyProviderDirect {
        getProxyForURL(url: string) {
            return "DIRECT";
        };
    }
    
    const url: string = "http://localhost";

    it("appProxy.makeHttpRequest", () => {
        appProxy.init(new ProxyProviderDirect());
        var proxyDescriptor = appProxy.makeHttpRequest(url);
        //assert.equal();
    });
});
