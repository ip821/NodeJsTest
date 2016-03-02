import http = require('http');
import fs = require('fs');
import stringUtils = require('./strings');

export interface DownloadManagerEventHandler {
    onCompleted(err: any);
    onProgress(dataLength: number, streamSize: number);
}

export class DownloadManager {
    eventHandler: DownloadManagerEventHandler;

    setEventHandler = (eventHandler: DownloadManagerEventHandler) => {
        this.eventHandler = eventHandler;
    }

    download = (appProxy, url, dest) => {
        var _self = this;
        console.log('Downloading START: ' + url);
        var headerRequestOptions = appProxy.makeHttpRequest(url);
        headerRequestOptions.method = 'HEAD';
        var headerRequest = http.get(headerRequestOptions, (headersResponse) => {
            var streamSize = 0;
            var dataLength = 0;
            if (headersResponse.headers) {
                streamSize = parseInt(headersResponse.headers['content-length']);
                fs.exists(dest, (exists) => {
                    if (exists) {
                        fs.stat(dest, (err, stats) => {
                            var fileSize = stats.size;
                            console.log(stringUtils.format('Stream size: {0}, File size: {1}', streamSize, fileSize));
                            headerRequest.end();
                            if (streamSize === fileSize) {
                                console.log('Skipping ' + dest);
                                _self.eventHandler.onCompleted(undefined);
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
                var request = http.get(appProxy.makeHttpRequest(url), (response) => {
                    response.on('data', (data) => {
                        file.write(data);
                        dataLength += data.length;
                        _self.eventHandler.onProgress(dataLength, streamSize);
                    })
                        .on('end', () => {
                            file.end();
                            file.close();
                            console.log('Downloading DONE: ' + url);
                            _self.eventHandler.onCompleted(undefined);
                        })
                        .on('error', (err) => {
                            console.log('Downloading FAIL: ' + url);
                            file.close();
                            fs.unlink(dest);
                            _self.eventHandler.onCompleted(err);
                        });
                });
            }
        });
    }
}
