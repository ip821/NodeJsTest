import assert = require('assert');
import proxy = require("../app_modules/proxy");
import strings = require('../app_modules/strings');

describe("appProxy", () => {

    class ProxyProviderDirect implements proxy.ProxyUrlProvider {
        getProxyForURL(url: string) {
            return "DIRECT";
        };
    }

    class ProxyProviderProxy implements proxy.ProxyUrlProvider {
        static host: string = "127.0.0.1";
        static port: string = "3128";

        getProxyForURL(url: string) {
            return strings.format("PROXY {0}:{1}", ProxyProviderProxy.host, ProxyProviderProxy.port);
        };
    }

    const url: string = "http://localhost";

    it("appProxy.makeHttpRequest - DIRECT", () => {
        proxy.init(new ProxyProviderDirect());
        
        var proxyDescriptor = proxy.makeHttpRequest(url);
        
        assert.equal(proxyDescriptor.host, "localhost", "proxyDescriptor.host");
        assert.equal(proxyDescriptor.path, "/", "proxyDescriptor.path");
        assert.equal(proxyDescriptor.port, null, "proxyDescriptor.port");
    });

    it("appProxy.makeHttpRequest - PROXY", () => {
        proxy.init(new ProxyProviderProxy());
        
        var proxyDescriptor = proxy.makeHttpRequest(url);
        
        assert.equal(proxyDescriptor.host, ProxyProviderProxy.host, "proxyDescriptor.host");
        assert.equal(proxyDescriptor.path, url, "proxyDescriptor.path");
        assert.equal(proxyDescriptor.port, ProxyProviderProxy.port, "proxyDescriptor.port");
    });
});
