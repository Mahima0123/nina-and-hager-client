import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/shoppingCart.service';
import { ProductService } from 'src/app/services/product.service'; // Import ProductService
import { Product } from 'src/app/model/product';
import { AlertService } from '../alert/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { quantity } from 'chartist';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  subTotal: number = 0;
  previousRoute: string = '/'; // Default to '/' if there's no previous route

  constructor(
    private shoppingCartService: ShoppingCartService,
    private productService: ProductService, // Inject ProductService
    private router: Router,
    private cdr: ChangeDetectorRef,
    public alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.updateSubTotal();
    
    // Retrieve previous route from navigation history
    const navigationHistory = this.router.getCurrentNavigation()?.previousNavigation;
    if (navigationHistory) {
      this.previousRoute = this.extractUrlFromUrlTree(navigationHistory.initialUrl) || '/';
    }
  }

  updateSubTotal(): void {
    this.subTotal = this.cartItems.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  }

  loadCartItems(): void {
    this.shoppingCartService.getCartItemsWithImages().subscribe(
      (cartItems: any[]) => {
        this.cartItems = cartItems;
        this.updateSubTotal();
      },
      (error: any) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  removeFromCart(item: any) {
    this.shoppingCartService.removeFromCart(item);
    this.loadCartItems();
    this.updateSubTotal();
  }

  async increaseQuantity(item: any) {
    try {
      const productDetails: Product | undefined = await this.productService.getProductById(item.id).toPromise();
      console.log('Product Details:', productDetails);
      if (productDetails && productDetails.quantity !== undefined) {
        if (productDetails.quantity > item.quantity) {
          console.log(quantity)
          item.quantity++;
          this.shoppingCartService.updateCartItemQuantity(item.id, item.quantity); // Update quantity in local storage
          this.updateSubTotal(); // Update subtotal after increasing quantity
          this.cdr.detectChanges();
        } else {
          this.alertService.warning('Sorry, the available quantity for this product is insufficient.');
        }
      } else {
        this.alertService.error('Product details not found or unavailable.');
      }
    } catch (error) {
      this.alertService.error('An error occurred while fetching product details. Please try again later.');
    }
  }
  
  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.shoppingCartService.updateCartItemQuantity(item.id, item.quantity); // Update quantity in local storage
      this.updateSubTotal(); // Update subtotal after decreasing quantity
      this.cdr.detectChanges();
    }
  }
  
  

  private extractUrlFromUrlTree(urlTree: UrlTree): string {
    // Extract the string representation of the URL from the UrlTree object
    return this.router.serializeUrl(urlTree);
  }

  continueShopping(): void {
    // Navigate back to the previous route
    this.router.navigateByUrl(this.previousRoute);
  }
}