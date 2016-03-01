"use strict";
var stringUtils = require('./app_modules/strings');
var _ = require('underscore');
var $ = require('jquery');
var View = (function () {
    function View() {
    }
    View.prototype.fillTable = function (audioList) {
        _.forEach(audioList, function (item) {
            $('#tableBody').append(stringUtils.format('<tr class="audioRow" id="{0}">', item.aid) +
                '<td>' + item.artist + '</td>' +
                '<td>' + item.title + '</td>' +
                '</tr>');
        });
        $('#syncBadge').html(audioList.length.toString());
    };
    View.prototype.setIdleState = function () {
        $('#stopButton').addClass('hidden');
        $('#syncButton').removeClass('hidden');
        $('#progressContainer').addClass('hidden');
        $('#progressSongContainer').addClass('hidden');
        $('#audioName').addClass('hidden');
    };
    View.prototype.setRunningState = function (itemNumber) {
        $('#stopButton').removeClass('hidden');
        $('#syncButton').addClass('hidden');
        $('#audioName').removeClass('hidden');
        $('#progressContainer').removeClass('hidden');
        $('#progressSongContainer').removeClass('hidden');
        $('#progress').attr('aria-valuemax', itemNumber);
        $('#progressSong').css('width', 0);
    };
    View.prototype.setRowError = function (aid) {
        $(stringUtils.format('#{0}.audioRow', aid)).removeClass('success');
        $(stringUtils.format('#{0}.audioRow', aid)).removeClass('warning');
        $(stringUtils.format('#{0}.audioRow', aid)).addClass('error');
    };
    View.prototype.setRowSuccess = function (aid) {
        $(stringUtils.format('#{0}.audioRow', aid)).removeClass('error');
        $(stringUtils.format('#{0}.audioRow', aid)).removeClass('warning');
        $(stringUtils.format('#{0}.audioRow', aid)).addClass('success');
    };
    View.prototype.setRowWarning = function (aid) {
        $(stringUtils.format('#{0}.audioRow', aid)).addClass('warning');
    };
    View.prototype.setStreamProgress = function (dataLegth, streamSize) {
        var percentValue = Math.round((dataLegth / streamSize) * 100) + '%';
        $('#progressSong').css('width', percentValue);
        $('#progressSong').html(percentValue);
    };
    View.prototype.setOverallProgress = function (index, length) {
        var percentValue = Math.floor((index / length) * 100) + '%';
        $('#progress').html(percentValue);
        $('#progress').css('width', percentValue);
        $('#progressSong').css('width', 0);
    };
    View.prototype.setOverallProgressDescription = function (message) {
        $('#audioName').html(message);
    };
    return View;
}());
exports.View = View;
//# sourceMappingURL=appView.js.map