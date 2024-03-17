import { Component } from '@angular/core';
import { AlertService } from '../components/alert/alert.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    showFeedbackPopup: boolean = false;
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService, private router: Router, public alertService: AlertService) { }
    
    ngOnInit() {
        this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
            this.isLoggedIn = isLoggedIn;
        });
    }

    toggleFeedbackPopup() {
        this.showFeedbackPopup = !this.showFeedbackPopup;
    }
}
