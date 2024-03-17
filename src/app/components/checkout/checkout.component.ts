import { Component } from '@angular/core';
import { AlertService } from '../alert/alert.service';
import { Router, UrlTree } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/shoppingCart.service';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/model/order';
import { OrderProduct } from 'src/app/model/orderProduct';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  cartItems: any[] = [];
  subTotal: number = 0;
  previousRoute: string = '/';
  customerDetails: { fullName: string, address: string, email: string, phoneNumber: string } = {
    fullName: '',
    address: '',
    email: '',
    phoneNumber: ''
  };
  selectedPaymentMethod: string = '';
  isFormValid: boolean = false;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    public alertService: AlertService,
    private orderService: OrderService,
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

  private extractUrlFromUrlTree(urlTree: UrlTree): string {
    // Extract the string representation of the URL from the UrlTree object
    return this.router.serializeUrl(urlTree);
  }

  continueShopping(): void {
    // Navigate back to the previous route
    this.router.navigateByUrl(this.previousRoute);
  }

  checkFormValidity() {
    this.isFormValid = this.customerDetails.fullName !== '' && this.customerDetails.address !== '' && this.customerDetails.email !== '' && this.customerDetails.phoneNumber !== '';
  }

  placeOrder() {
    // Map cart items to order products
    const products: OrderProduct[] = this.cartItems.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
      sub_total: this.subTotal
    }));
  
    // Get the current user ID or use 0 if not available
    const userId = this.authService.getCurrentUser()?.id || 0;
  
    // Create the order object
    const order: Order = {
      userId: userId,
      fullName: this.customerDetails.fullName,
      address: this.customerDetails.address,
      email: this.customerDetails.email,
      phoneNumber: this.customerDetails.phoneNumber,
      paymentMethod: this.selectedPaymentMethod,
      cartId: this.cartItems[0].id, // Assuming cart_id is retrieved from cartItems
      products: products,
    };
  
    // Call the orderService.placeOrder method with the order object
    this.orderService.placeOrder(order).subscribe(
      (response) => {
        // Handle success
        this.alertService.success('Order placed successfully.');
      },
      (error) => {
        //show an error message to the user
        this.alertService.error('Failed to place order. Please try again later.');
      }
    );
  }
  
}
