import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3000/products';
    private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
    products$: Observable<Product[]> = this.productsSubject.asObservable();
    Products: Product[] = [];
    filteredProducts: Product[] = [];

    constructor(private http: HttpClient) {}

    addProduct(product: Product): Observable<any> {
        const formData = new FormData();

        // Ensure that each field is defined before appending to formData
        formData.append('id', product.id ? String(product.id) : '-');
        formData.append('product_name', product.product_name || '-');
        formData.append('product_desc', product.product_desc || '-');
        formData.append('category', product.category || '-');
        formData.append('quantity', product.quantity ? String(product.quantity) : '-');
        formData.append('unit_price', product.unit_price ? String(product.unit_price) : '-');
        formData.append('image', product.image || '');

        return this.http.post(this.apiUrl, formData);
    }

    // for getting the products in view-products page
    getProducts(): Observable<Product[]> {
        const url = this.apiUrl;
        return this.http.get<Product[]>(url);
    }

    //for getting the products in the feature-products page
    getRandomFeaturedProducts(count: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/random?count=${count}`);
    }

    //for getting the products in the product-details page
    getProductById(productId: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${productId}`);
    }
}