import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shoppingCart.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from '../alert/alert.service';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-feature-products',
  templateUrl: './feature-products.component.html',
  styleUrls: ['./feature-products.component.css']
})
export class FeatureProductsComponent implements OnInit {
  isLoggedIn: boolean = false;
  featuredProducts: any[] = [];

  constructor(private productService: ProductService, private shoppingCartService: ShoppingCartService, private favoriteService: FavoriteService, private router: Router, private authService: AuthService, public alertService: AlertService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.productService.getRandomFeaturedProducts(8).subscribe(
      (data) => {
        this.featuredProducts = data;
      },
      (error) => {
        console.error('Error fetching featured products:', error);
      }
    );
  }

  addToCart(product: any) {
    if (!this.isLoggedIn) {
        this.alertService.error("Please login first.")
    } else {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            this.alertService.error("Failed to retrieve current user information.");
            return;
        }

        // Check maximum quantity reached for this product in the cart
        const cartItems = this.shoppingCartService.getCartItems();
        const cartItem = cartItems.find((item: any) => item.product_id === product.id);
        if (cartItem && cartItem.quantity >= product.quantity) {
            this.alertService.error("Maximum quantity reached for this product.");
            return;
        }

        // Add to cart
        this.shoppingCartService.addToCart(product);
        this.alertService.success("Product added to cart.");

        // Save cart item
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