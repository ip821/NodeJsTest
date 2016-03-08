import {Injectable, Component, EventEmitter, Input, Output, NgZone} from "angular2/core";
import { CORE_DIRECTIVES } from 'angular2/common';
import {PROGRESSBAR_DIRECTIVES, BUTTON_DIRECTIVES} from "ng2-bootstrap";
import {Alert} from 'ng2-bootstrap';

@Injectable()
@Component({
    selector: "header",
    directives: [PROGRESSBAR_DIRECTIVES, CORE_DIRECTIVES, BUTTON_DIRECTIVES],
    template: `
    <button type="button" class="btn btn-primary" [class.hidden]="!_syncButtonVisible" (click)="onViewSyncClick()">
        Sync
        <span class='badge' id='syncBadge'>{{_count}}</span>
    </button>
    <button type="button" class="btn btn-primary" [class.hidden]="_syncButtonVisible" (click)="onViewStopClick()">Stop</button>
    <progressbar [value]="_overallProgressValue" max="100" [class.hidden]="_syncButtonVisible">{{_overallProgressValue}}%</progressbar>
    <progressbar [value]="_songProgressValue" max="100" [animate]="false" [class.hidden]="_syncButtonVisible">{{_songProgressValue}}%</progressbar>
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
        this._overallProgressValue = percentValue;
        this._songProgressValue = 0;
    }

    setOverallProgressDescription = (message: string) => {
        this._message = message;
    }

}