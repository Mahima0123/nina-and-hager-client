import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/shoppingCart.service';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from '../alert/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/model/product';

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
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCartItemsFromLocalStorage();
    
    // Retrieve previous route from navigation history
    const navigationHistory = this.router.getCurrentNavigation()?.previousNavigation;
    if (navigationHistory) {
      this.previousRoute = this.extractUrlFromUrlTree(navigationHistory.initialUrl) || '/';
    }
  }

  updateSubTotal(): void {
    this.subTotal = this.cartItems.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  }

  loadCartItemsFromLocalStorage(): void {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
      this.updateSubTotal(); // Update subtotal after loading cart items
    }
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
  }

  async increaseQuantity(item: any) {
    try {
      const productDetails: Product | undefined = await this.productService.getProductById(item.id).toPromise();
      if (productDetails && productDetails.quantity !== undefined) {
        if (productDetails.quantity > item.quantity) {
          item.quantity++;
          this.shoppingCartService.updateCartItemQuantity(item.id, item.quantity); // Update quantity in local storage
          this.updateSubTotal(); // Update subtotal after increasing quantity
          this.updateCartInLocalStorage(); // Update cart items in local storage
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
      this.updateCartInLocalStorage(); // Update cart items in local storage
    }
  }
  
  updateCartInLocalStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
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