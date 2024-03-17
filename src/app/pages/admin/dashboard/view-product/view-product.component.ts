// view-product.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  isLoggedIn: boolean = false;
  currentDate: Date = new Date();
  currentTab: string = 'dashboard';
  products: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    public alertService: AlertService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      }
    );

    // fetch products
    this.fetchProducts();
  }

  showTab(tabName: string) {
    this.currentTab = tabName;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToLogin(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  // Fetch products from the server
  fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (data: any[]) => {
        this.products = data;
      },
      (error) => {
        this.alertService.error('Error fetching products');
      }
    );
  }
}
