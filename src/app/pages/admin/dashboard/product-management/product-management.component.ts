import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/model/product'; // Import the Product model

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  isLoggedIn: boolean = false;
  currentDate: Date = new Date();
  currentTab: string = 'dashboard'; // the default active tab

  newProduct: any = {}; // Initialize newProduct with the Product interface
  products: Product[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    public alertService: AlertService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      }
    );
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

  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe(
      (response: any) => {
        // Handle successful submission (optional)
        this.alertService.success('Product added successfully:');
        this.getProducts();
      },
      (error: any) => {
        // Handle error (optional)
        this.alertService.error('Error adding product');
      }
    );
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        // Handle error (optional)
        this.alertService.error('Error fetching products');
      }
    );
  }

  handleImageChange(event: any): void {
    const file = event.target.files[0];
    // Assign the file (Blob) to the newProduct.image property
    this.newProduct.image = file;
    this.previewImage(file);
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.newProduct.imagePreview = e.target.result;
    };

    reader.readAsDataURL(file);
  }
  
}
