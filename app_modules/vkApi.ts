import $ = require('jquery');
import _ = require('underscore');

var strUrl = 'http://oauth.vk.com/authorize?client_id=4225742&scope=8&redirect_uri=http://oauth.vk.com/blank.html&display=wap&response_type=token';
var strUrlApi = 'https://api.vk.com/method/';

var appInit = require('./appInit');

export function openLoginWindow(parentWindow: Window, onClosedCallback: (userId: string, accessToken: string)=> void) {
    var intervalId = parentWindow.setInterval(hashUpdate, 500);
    var loginWindow: Window = parentWindow.open(strUrl, "Login");

    var userId = undefined;
    var accessToken = undefined;

    function hashUpdate() {
        if (loginWindow.closed) {
            parentWindow.clearInterval(intervalId);
            console.log("userId: " + userId);
            console.log("accessToken: " + accessToken);
            onClosedCallback(userId, accessToken);
        } else {
            var strUrl = loginWindow.document.URL;
            if (strUrl.indexOf('#') > -1) {
                var strParams = strUrl.split('#')[1];
                if (strParams.indexOf('&') > -1) {
                    var params = strParams.split('&');
                    console.log(params);

                    params.forEach(function(item) {
                        var keyValue = item.split('=');
                        if (keyValue[0] === 'user_id') {
                            userId = keyValue[1];
                            console.log("userId: " + userId);
                        }
                        if (keyValue[0] === 'access_token') {
                            accessToken = keyValue[1];
                            console.log("accessToken: " + accessToken);
                        }
                    });
                    loginWindow.close();
                }
            }
        }
    }
}

export function getAudioList(userId: string, accessToken: string, onSuccessCallback: (args: AudioListItem[]) => void, onErrorCallback: (e: any) => void) {
    console.log('vkApi.getAudioList: userId=' + userId + 'accessToken=' + accessToken);
    var strUrl = strUrlApi + 'audio.get?' + $.param({
        uid: userId,
        access_token: accessToken
    })
    console.log("Request:");
    console.log(strUrl);
    $.ajax({
        type: 'GET',
        url: strUrl,
        data: {},
        success: (e) => { onSuccessCallback(conevrtVkAudioList(e.response)); },
        error: (e) => { onErrorCallback(e); }
    })
}

export interface AudioListItem{
    aid: number;
    artist: string;
    title: string;
    url: string;
}

function conevrtVkAudioList(audioList: any[]): AudioListItem[] {
    var result = _.map(audioList, t => {return {aid: t.aid, artist: t.artist, title: t.title, url: t.url}});
    return result;
}