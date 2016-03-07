import {Injectable, Component, EventEmitter, Input, Output, NgZone} from "angular2/core";

@Injectable()
@Component({
    selector: "header",
    template: `
    <a 
        id="syncButton" 
        class="btn btn-primary" 
        [class.hidden]="!_syncButtonVisible" 
        (click)="onViewSyncClick()"
        >
        Sync 
        <span class='badge' id='syncBadge'>{{_count}}</span>
    </a>
    <a 
        id="stopButton" 
        class="btn btn-primary" 
        [class.hidden]="_syncButtonVisible" 
        (click)="onViewStopClick()"
        >
        Stop
    </a>
    <div id='progressContainer' class="progress" [class.hidden]="_syncButtonVisible">
        <div 
            id='progress' 
            class="progress-bar progress-bar-striped active" 
            role="progressbar" 
            aria-valuenow="0" 
            aria-valuemin="0"
            aria-valuemax="100" 
            [style.width.%]="_overallProgressValue"
            >
        {{_overallProgressValue}}%
        </div>
    </div>
    <div id='progressSongContainer' class="progress" [class.hidden]="_syncButtonVisible">
        <div 
            id='progressSong' 
            class="progress-bar progress-bar-striped active progress-bar-no-animation" 
            role="progressbar" 
            aria-valuenow="0"
            aria-valuemin="0" 
            aria-valuemax="100" 
            [style.width.%]="_songProgressValue"
            >
        {{_songProgressValue}}%
        </div>
    </div>
    <p id='audioName' class='hidden' [class.hidden]="_syncButtonVisible">{{_message}}</p>
    `
})
export class HeaderComponent {

    @Output() onClickSync = new EventEmitter();
    @Output() onClickStop = new EventEmitter();
    @Input() private _count: number;
    @Input() private _message: string;
    @Input() private _syncButtonVisible = true;
    @Input() private _overallProgressValue = 0;
    @Input() private _songProgressValue = 0;

    constructor() { }

    onViewSyncClick = () => {
        this.onClickSync.next(null);
    }

    onViewStopClick = () => {
        this.onClickStop.next(null);
    }

    setCount = (count: number) => {
        this._count = count;
    }

    setIdleState = () => {
        this._syncButtonVisible = true;
    }

    setRunningState = (itemNumber: number) => {
        this._syncButtonVisible = false;

        this._overallProgressValue = 0;
        this._songProgressValue = 0;
    }

    setStreamProgress = (dataLegth: number, streamSize: number) => {
        var percentValue = Math.round((dataLegth / streamSize) * 100);
        this._songProgressValue = percentValue;
    }

    setOverallProgress = (index: number, length: number) => {
        var percentValue = Math.floor((index / length) * 100);
        this._overallProgressValue = percentValue
        this._songProgressValue = 0;
    }

    setOverallProgressDescription = (message: string) => {
        this._message = message;
    }

}