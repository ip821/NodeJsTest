import assert = require('assert');
import appProxy = require("../app_modules/appProxy");
import strings = require('../app_modules/strings');

describe("appProxy", () => {

    class ProxyProviderDirect implements appProxy.ProxyUrlProvider {
        getProxyForURL(url: string) {
            return "DIRECT";
        };
    }

    class ProxyProviderProxy implements appProxy.ProxyUrlProvider {
        static host: string = "127.0.0.1";
        static port: string = "3128";

        getProxyForURL(url: string) {
            return strings.format("PROXY {0}:{1}", ProxyProviderProxy.host, ProxyProviderProxy.port);
        };
    }

    const url: string = "http://localhost";

    it("appProxy.makeHttpRequest - DIRECT", () => {
        appProxy.init(new ProxyProviderDirect());
        
        var proxyDescriptor = appProxy.makeHttpRequest(url);
        
        assert.equal(proxyDescriptor.host, "localhost", "proxyDescriptor.host");
        assert.equal(proxyDescriptor.path, "/", "proxyDescriptor.path");
        assert.equal(proxyDescriptor.port, null, "proxyDescriptor.port");
    });

    it("appProxy.makeHttpRequest - PROXY", () => {
        appProxy.init(new ProxyProviderProxy());
        
        var proxyDescriptor = appProxy.makeHttpRequest(url);
        
        assert.equal(proxyDescriptor.host, ProxyProviderProxy.host, "proxyDescriptor.host");
        assert.equal(proxyDescriptor.path, url, "proxyDescriptor.path");
        assert.equal(proxyDescriptor.port, ProxyProviderProxy.port, "proxyDescriptor.port");
    });
});
