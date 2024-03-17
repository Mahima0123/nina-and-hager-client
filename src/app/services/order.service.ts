import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../model/order';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:3000/orders';

    constructor(private http: HttpClient) {}

    placeOrder(order: Order): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, order);
    }
}
