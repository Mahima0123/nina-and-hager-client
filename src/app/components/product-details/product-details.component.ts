import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from '../alert/alert.service';
import { ShoppingCartService } from 'src/app/services/shoppingCart.service';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId!: number;
  product: any;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    public alertService: AlertService,
    private shoppingCartService: ShoppingCartService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.route.paramMap.subscribe(params => {
      this.productId = +params.get('id')!;
      this.getProductDetails(this.productId);
    });

  }

  getProductDetails(productId: number): void {
    this.productService.getProductById(productId).subscribe((product: any) => {
      this.product = product;
      // the image URL using the product ID
      this.product.imageUrl = `http://localhost:3000/product-images/${product.id}`;
    });
  }

  addToCart(product: any) {
    if (!this.isLoggedIn) {
      this.alertService.error("Please login first.")
    } else {
      const cartItems = this.shoppingCartService.getCartItems();
      const cartItem = cartItems.find((item: any) => item.product_id === product.id);
      if (cartItem && cartItem.quantity >= product.quantity) {
        this.alertService.error("Maximum quantity reached for this product.");
      } else {
        this.shoppingCartService.addToCart(product);
        this.alertService.success("Product added to cart.");
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          const cartItemToSend = {
            user_id: currentUser.id,
            product_id: product.id,
            product_name: product.product_name,
            quantity: 1,
            unit_price: product.unit_price,
            total_price: product.unit_price,
            sub_total: product.unit_price
          };
          this.shoppingCartService.saveCartItem(cartItemToSend).subscribe(
            (response: any) => {
              console.log('Cart item saved successfully');
              this.alertService.success("Product added to cart.");
            },
            (error: any) => {
              this.alertService.error("Failed to add product to cart. Please try again.");
            }
          );
        } else {
          this.alertService.error("Failed to retrieve current user information.");
        }
      }
    }
  }

  addToFavorites(product: any) {
    if (!this.isLoggedIn) {
      this.alertService.error("Please login first.")
    } else {
      this.favoriteService.addToFavorite(product);
      this.alertService.success("Product added to cart.");
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const cartItemToSend = {
          user_id: currentUser.id,
          product_id: product.id,
          product_name: product.product_name,
          unit_price: product.unit_price
        };
        this.favoriteService.saveFavoriteItem(cartItemToSend).subscribe(
          (response: any) => {
            console.log('Cart item saved successfully');
            this.alertService.success("Product added to cart.");
          },
          (error: any) => {
            this.alertService.error("Failed to add product to cart. Please try again.");
          }
        );
      } else {
        this.alertService.error("Failed to retrieve current user information.");
      }
    }
  }
}
