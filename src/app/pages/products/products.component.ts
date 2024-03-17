import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/components/alert/alert.service';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/services/auth.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shoppingCart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  Products: any[] = [];
  isLoggedIn: boolean = false;
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'All'; // Initialize selectedCategory to 'All'
  showFeedbackPopup: boolean = false;

  constructor(private authService: AuthService, private productService: ProductService, private alertService: AlertService, private shoppingCartService: ShoppingCartService, private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.loadFeaturedProducts();
    // Initialize filteredProducts to match Products initially
    this.filteredProducts = [...this.Products];
    console.log('filteredProducts:', this.filteredProducts); // Log the initial state of filteredProducts
  }

  loadFeaturedProducts() {
    this.productService.getProducts().subscribe(
      (data) => {
        this.Products = data;
        // Initially, display all products
        this.filteredProducts = this.Products;
      },
      (error) => {
        this.alertService.error('Error fetching featured products');
      }
    );
  }

  // Filter products based on selected category, sub-category, and sub-sub-category
  filterProducts() {
    if (this.selectedCategory === 'All') {
      this.filteredProducts = this.Products;
    } else {
      this.filteredProducts = this.Products.filter(product => product.category === this.selectedCategory);
    }
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

  // Function to sort products based on selected option
  sortProducts(event: any): void {
    const sortBy = event.target.value;
    if (sortBy === '') {
        // Reset filteredProducts to original state
        this.loadFeaturedProducts();
    } else if (sortBy === 'lowToHigh') {
        this.filteredProducts.sort((a, b) => a.unit_price - b.unit_price);
    } else if (sortBy === 'highToLow') {
        this.filteredProducts.sort((a, b) => b.unit_price - a.unit_price);
    }
  }

  // Filter products based on search query
  searchProducts(searchQuery: string) {
    this.searchQuery = searchQuery.trim().toLowerCase();
    if (this.searchQuery === '') {
      this.filteredProducts = this.Products; // Show all products if search query is empty
    } else {
      this.filteredProducts = this.Products.filter(product =>
        product.product_name.toLowerCase().includes(this.searchQuery)
      );
    }
  }

  onCategorySelected(category: any) {
    this.selectedCategory = category.name;
    this.filterProducts(); // Filter products when category changes
  }

  toggleFeedbackPopup() {
    this.showFeedbackPopup = !this.showFeedbackPopup;
}
}