import http = require('http');
import fs = require('fs');
import stringUtils = require('./strings');

export function download(appProxy, url, dest, callback, progressCallback) {
    console.log('Downloading START: ' + url);
    var headerRequestOptions = appProxy.makeHttpRequest(url);
    headerRequestOptions.method = 'HEAD';
    var headerRequest = http.get(headerRequestOptions, function(headersResponse) {
        var streamSize = 0;
        var dataLength = 0;
        if (headersResponse.headers) {
            streamSize = parseInt(headersResponse.headers['content-length']);
            fs.exists(dest, function(exists) {
                if (exists) {
                    fs.stat(dest, function(err, stats) {
                        var fileSize = stats.size;
                        console.log(stringUtils.format('Stream size: {0}, File size: {1}', streamSize, fileSize));
                        headerRequest.end();
                        if (streamSize === fileSize) {
                            console.log('Skipping ' + dest);
                            callback();
                            return;
                        }
                        downloadInternal();
                    });
                    return;
                }
                downloadInternal();
            });
            return;
        }

        downloadInternal();

        function downloadInternal() {
            var file = fs.createWriteStream(dest);
            var request = http.get(appProxy.makeHttpRequest(url), function(response) {
                response.on('data', function(data) {
                    file.write(data);
                    dataLength += data.length;
                    progressCallback(streamSize, dataLength);
                })
                    .on('end', function() {
                        file.end();
                        file.close();
                        console.log('Downloading DONE: ' + url);
                    })
                    .on('error', function(err) {
                        console.log('Downloading FAIL: ' + url);
                        file.close();
                        fs.unlink(dest);
                        if (callback)
                            callback(err);
                    });
            });
        }
    });
}
