// header.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    isLoggedIn: boolean = false;
    searchQuery: string = '';
    @Output() searchQueryChange = new EventEmitter<string>(); // Add EventEmitter

    constructor(private authService: AuthService, private router: Router, public alertService: AlertService, private productService: ProductService) { }

    ngOnInit() {
        this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
            this.isLoggedIn = isLoggedIn;
        });
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

    checkUserForCart() {
        if (!this.isLoggedIn) {
            this.alertService.error("Please login first.")
        } else {
            this.router.navigate(['/shopping-cart']);
        }
    }

    //check if user has logged in or not
    checkUserForProfile() {
        if (!this.isLoggedIn) {
            this.alertService.error("There is no user. Please login first.")
        } else {
            this.router.navigate(['/userProfile']);
        }
    }

    checkUserForFavorite() {
        if (!this.isLoggedIn) {
            this.alertService.error("There is no user. Please login first.")
        } else {
            this.router.navigate(['/favorites']);
        }
    }

    searchProducts() {
        this.searchQueryChange.emit(this.searchQuery); // Emit the search query to the parent component
    }
}
