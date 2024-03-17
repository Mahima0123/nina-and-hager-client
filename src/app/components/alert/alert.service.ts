import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    private alertSubject = new Subject<any>();

    constructor() { }

    private showAlert(type: string, message: string) {
        this.alertSubject.next({ type, text: message });

        // Delay clearing the message after 3000 milliseconds (adjust the time as needed)
        setTimeout(() => {
            this.clearMessage();
        }, 3000);
    }

    success(message: string) {
        this.showAlert('success', message);
    }

    error(message: string) {
        this.showAlert('error', message);
    }

    warning(message: string) {
        this.showAlert('warning', message);
    }

    info(message: string) {
        this.showAlert('info', message);
    }

    clearMessage() {
        this.alertSubject.next();
    }

    getMessage(): Observable<any> {
        return this.alertSubject.asObservable();
    }
}
