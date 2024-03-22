import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { ProductService } from './product.service';
import { Product } from '../model/product'; // Import Product model
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {
    private cartItemsSubject = new BehaviorSubject<any[]>([]);
    cartItems$ = this.cartItemsSubject.asObservable();

    constructor(private productService: ProductService, private http: HttpClient, private authService: AuthService) {
        // Initialize cart items from localStorage when the service is instantiated
        this.initCartItems();
    }

    initCartItems(): void {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            const cartItems: any[] = JSON.parse(storedCartItems);
            this.cartItemsSubject.next(cartItems);
        }
    }


    addToCart(product: Product): void {
        const existingItemIndex = this.cartItemsSubject.value.findIndex(item => item.id === product.id);
    
        if (existingItemIndex !== -1) {
            const updatedCartItems = [...this.cartItemsSubject.value];
            updatedCartItems[existingItemIndex].quantity++;
            this.cartItemsSubject.next(updatedCartItems);
            this.updateLocalStorage(this.cartItemsSubject.value);
        } else {
            const updatedCartItems = [...this.cartItemsSubject.value, { ...product, imageUrl: `http://localhost:3000/product-images/${product.id}`, quantity: 1 }];
            this.cartItemsSubject.next(updatedCartItems);
            this.updateLocalStorage(updatedCartItems);
        }
        // Update local storage
        this.updateLocalStorage(this.cartItemsSubject.value);
    }

    removeFromCart(item: any): void {
        const updatedCartItems = this.cartItemsSubject.value.filter(cartItem => cartItem.id !== item.id);
        this.cartItemsSubject.next(updatedCartItems);
        this.updateLocalStorage(updatedCartItems);
        // Remove from backend
        this.deleteCartItem(item.id).subscribe(
            () => {
                console.log('Cart item removed successfully');
            },
            (error: any) => {
                console.error('Error removing cart item:', error);
            }
        );
    }
    
    deleteCartItem(itemId: number): Observable<any> {
        return this.http.delete(`http://localhost:3000/cart/${itemId}`);
    }

    getCartItems(): any[] {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            return JSON.parse(storedCartItems);
        }
        return [];
    }

    calculateTotalPrice(): number {
        const cartItems = this.cartItemsSubject.value;
        let totalPrice = 0;
        for (const item of cartItems) {
            totalPrice += item.unit_price * item.quantity;
        }
        return totalPrice;
    }

    getCartItemsWithImages(): Observable<any[]> {
        return this.getCartItemsByUserId().pipe(
            map(cartItems => {
                return cartItems.map(item => ({
                    ...item,
                    imageUrl: `http://localhost:3000/product-images/${item.product_id}`
                }));
            })
        );
    }

    private getCartItemsByUserId(): Observable<any[]> {
        const userId = this.authService.getCurrentUser()?.id;
        return this.http.get<any[]>(`http://localhost:3000/cart/${userId}`);
    }

    updateCartItemQuantity(itemId: number, newQuantity: number): void {
        const cartItems = this.cartItemsSubject.value;
        const updatedCartItems = cartItems.map(item => {
            if (item.id === itemId) {
            return { ...item, quantity: newQuantity };
        }
            return item;
        });
        this.cartItemsSubject.next(updatedCartItems);
        this.updateLocalStorage(updatedCartItems);
    }

    private updateLocalStorage(cartItems: any[]): void {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    //for saving the products into cart table
    saveCartItem(cartItem: any) {
        return this.http.post('http://localhost:3000/cart', cartItem);
    }
}