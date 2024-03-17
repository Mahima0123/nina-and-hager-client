// spinner.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SpinnerService {
    private spinnerSubject = new Subject<boolean>();

    constructor() { }

    show() {
        this.spinnerSubject.next(true);
    }

    hide() {
        this.spinnerSubject.next(false);
    }

    getSpinnerState(): Observable<boolean> {
        return this.spinnerSubject.asObservable();
    }
}
