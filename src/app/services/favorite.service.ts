import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ProductService } from './product.service';
import { Product } from '../model/product'; // Import Product model
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private favoriteItemsSubject = new BehaviorSubject<any[]>([]);
    favoriteItems$ = this.favoriteItemsSubject.asObservable();

    constructor(private authService: AuthService, private http: HttpClient) {
        // Initialize cart items from localStorage when the service is instantiated
        this.initFavoriteItems();
    }

    initFavoriteItems(): void {
        const storedFavoriteItems = localStorage.getItem('favoriteItems');
        if (storedFavoriteItems) {
            const favoriteItems: any[] = JSON.parse(storedFavoriteItems);
            this.favoriteItemsSubject.next(favoriteItems);
        }
    }

    addToFavorite(product: Product): void {
        const existingItemIndex = this.favoriteItemsSubject.value.findIndex(item => item.id === product.id);
    
        if (existingItemIndex !== -1) {
            const updatedFavoriteItems = [...this.favoriteItemsSubject.value];
            updatedFavoriteItems[existingItemIndex].quantity++;
            this.favoriteItemsSubject.next(updatedFavoriteItems);
            this.updateLocalStorage(updatedFavoriteItems);
        } else {
            const updatedFavoriteItems = [...this.favoriteItemsSubject.value, { ...product, imageUrl: `http://localhost:3000/product-images/${product.id}`, quantity: 1 }];
            this.favoriteItemsSubject.next(updatedFavoriteItems);
            this.updateLocalStorage(updatedFavoriteItems);
        }
        this.updateLocalStorage(this.favoriteItemsSubject.value);
    }

    removeFromFavorite(item: any): void {
        const updatedFavoriteItems = this.favoriteItemsSubject.value.filter(favoriteItem => favoriteItem.id !== item.id);
        this.favoriteItemsSubject.next(updatedFavoriteItems);
        this.updateLocalStorage(updatedFavoriteItems);
        // Remove from backend
        this.deleteFavoriteItem(item.id).subscribe(
            () => {
                console.log('Favorite item removed successfully');
            },
            (error: any) => {
                console.error('Error removing favorite item:', error);
            }
        );
    }
    
    deleteFavoriteItem(itemId: number): Observable<any> {
        return this.http.delete(`http://localhost:3000/favorites/${itemId}`);
    }

    //updating cart storage
    private updateLocalStorage(favoriteItems: any[]): void {
        localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
    }

    getFavoriteItems(): any[] {
        const storedFavoriteItems = localStorage.getItem('favoriteItems');
        if (storedFavoriteItems) {
            return JSON.parse(storedFavoriteItems);
        }
        return [];
    }

    getFavoriteItemsWithImages(): Observable<any[]> {
        return this.getFavoriteItemsByUserId().pipe(
            map(favoriteItems => {
                return favoriteItems.map(item => ({
                    ...item,
                    imageUrl: `http://localhost:3000/product-images/${item.product_id}`
                }));
            })
        );
    }

    private getFavoriteItemsByUserId(): Observable<any[]> {
        const userId = this.authService.getCurrentUser()?.id;
        return this.http.get<any[]>(`http://localhost:3000/favorites/${userId}`);
    }

    //for saving the products into cart table
    saveFavoriteItem(favoriteItem: any) {
        return this.http.post('http://localhost:3000/favorites', favoriteItem);
    }
}