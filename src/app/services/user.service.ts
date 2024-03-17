import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})

export class UserService {
    constructor(private http: HttpClient) {}

    //user management and user deletion
    apiUrl = 'http://localhost:3000/users';

    deleteUser(userId: number): Observable<void> {
        const url = `${this.apiUrl}/${userId}`;
        return this.http.delete<void>(url);
    }
}