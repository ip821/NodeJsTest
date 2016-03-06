import {Injectable, Component, EventEmitter, Input, Output, NgZone} from "angular2/core";

@Injectable()
@Component({
    selector: "header",
    template: `
    <a id="syncButton" class="btn btn-primary" (click)="onViewSyncClick()">Sync <span class='badge' id='syncBadge'>{{_count}}</span></a>
    <a id="stopButton" class="btn btn-primary hidden" (click)="onViewStopClick()">Stop</a>
    <div class="progress hidden" id='progressContainer'>
        <div id='progress' class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100" style="width: 0%">
        </div>
    </div>
    <div class="progress hidden" id='progressSongContainer'>
        <div id='progressSong' class="progress-bar progress-bar-striped active progress-bar-no-animation" role="progressbar" aria-valuenow="0"
        aria-valuemin="0" aria-valuemax="100" style="width: 0%">
        </div>
    </div>
    <p id='audioName' class='hidden'></p>
    `
})
export class HeaderComponent {

    @Output() onClickSync = new EventEmitter();
    @Output() onClickStop = new EventEmitter();
    @Input() private _count: number;

    constructor(private _ngZone: NgZone) { }

    onViewSyncClick = () => {
        this.onClickSync.next(null);
    }

    onViewStopClick = () => {
        this.onClickStop.next(null);
    }

    setCount = (count: number) => {
        this._ngZone.run(() => this._count = count);
    }

    setIdleState = () => {
        $('#stopButton').addClass('hidden');
        $('#syncButton').removeClass('hidden');
        $('#progressContainer').addClass('hidden');
        $('#progressSongContainer').addClass('hidden');
        $('#audioName').addClass('hidden');
    }

    setRunningState = (itemNumber: number) => {
        $('#stopButton').removeClass('hidden');
        $('#syncButton').addClass('hidden');

        $('#audioName').removeClass('hidden');
        $('#progressContainer').removeClass('hidden');
        $('#progressSongContainer').removeClass('hidden');
        $('#progress').attr('aria-valuemax', itemNumber);
        $('#progressSong').css('width', 0);
    }

    setStreamProgress = (dataLegth: number, streamSize: number) => {
        var percentValue = Math.round((dataLegth / streamSize) * 100) + '%';
        $('#progressSong').css('width', percentValue);
        $('#progressSong').html(percentValue);
    }

    setOverallProgress = (index: number, length: number) => {
        var percentValue = Math.floor((index / length) * 100) + '%';
        $('#progress').html(percentValue);
        $('#progress').css('width', percentValue);
        $('#progressSong').css('width', 0);
    }

    setOverallProgressDescription = (message: string) => {
        $('#audioName').html(message);
    }

}