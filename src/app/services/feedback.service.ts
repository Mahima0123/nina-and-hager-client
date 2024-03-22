import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private apiUrl = 'http://localhost:3000/feedback';

    constructor(private http: HttpClient) { }

    // getFeedback(): Observable<any[]> {
    //     return this.http.get<any[]>(this.apiUrl);
    // }

    getFeedbackWithUserNames(): Observable<any[]> {
        return this.http.get<any[]>('http://localhost:3000/feedback-with-users');
    }
}
