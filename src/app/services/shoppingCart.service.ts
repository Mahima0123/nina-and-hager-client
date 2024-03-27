import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { ProductService } from './product.service';
import { Product } from '../model/product'; // Import Product model
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AlertService } from '../components/alert/alert.service';

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {
    private cartItemsSubject = new BehaviorSubject<any[]>([]);
    cartItems$ = this.cartItemsSubject.asObservable();

    constructor(private productService: ProductService, private http: HttpClient, private authService: AuthService, private alertService: AlertService) {
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
            this.updateLocalStorage(updatedCartItems);
        } else {
            // Check if the available quantity is sufficient
            if (product.quantity > 0) {
                const updatedCartItems = [...this.cartItemsSubject.value, { ...product, imageUrl: `http://localhost:3000/product-images/${product.id}`, quantity: 1 }];
                this.cartItemsSubject.next(updatedCartItems);
                this.updateLocalStorage(updatedCartItems);
            } else {
                this.alertService.warning('Sorry, the available quantity for this product is insufficient.');
            }
        }
        // Update local storage
        this.updateLocalStorage(this.cartItemsSubject.value);
    }
    

    removeFromCart(item: any): Observable<any> {
        return this.deleteCartItem(item.id).pipe(
            switchMap(() => {
                const updatedCartItems = this.cartItemsSubject.value.filter(cartItem => cartItem.id !== item.id);
                this.cartItemsSubject.next(updatedCartItems);
                this.updateLocalStorage(updatedCartItems);
                return of(null); // Emit null to indicate successful removal
            }),
            catchError((error: any) => {
                console.error('Error removing cart item:', error);
                return throwError('Failed to remove product from cart. Please try again.');
            })
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

    // updateCartItemQuantity(itemId: number, newQuantity: number): void {
    //     const cartItems = this.cartItemsSubject.value;
    //     const updatedCartItems = cartItems.map(item => {
    //         if (item.id === itemId) {
    //         return { ...item, quantity: newQuantity };
    //     }
    //         return item;
    //     });
    //     this.cartItemsSubject.next(updatedCartItems);
    //     this.updateLocalStorage(updatedCartItems);
    // }

    private updateLocalStorage(cartItems: any[]): void {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    //for saving the products into cart table
    saveCartItem(cartItem: any) {
        return this.http.post('http://localhost:3000/cart', cartItem);
    }

    updateCartItemQuantity(itemId: number, newQuantity: number): Observable<any> {
        return this.http.put(`http://localhost:3000/cart/${itemId}`, { quantity: newQuantity });
    }

    removeItemsByCartId(cartId: number): Observable<any> {
        return this.http.delete(`http://localhost:3000/cart/${cartId}`);
    }
}