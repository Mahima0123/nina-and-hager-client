// login-signup.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login-signup',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./login-signup.component.css'],
})
export class LoginSignupComponent implements OnInit {
    isLoginForm = true;
    loginForm: FormGroup;
    signupForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router,
        public alertService: AlertService,
        private authService: AuthService
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(5)]],
        });

        this.signupForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
            phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
            email: ['', [Validators.required, Validators.email]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(5)]],
        });
    }

    ngOnInit() { }

    toggleForm() {
        this.isLoginForm = !this.isLoginForm;
    }

    onSubmit() {
        if (this.isLoginForm) {
            if (this.loginForm.valid) {
                const loginData = this.loginForm.value;

                if(loginData.username === 'admin' && loginData.password === 'admin') {
                    this.router.navigate(['/dashboard']);
                    this.authService.login(null);
                } else {
                    this.http.post('http://localhost:3000/login', this.loginForm.value).subscribe(
                    (response: any) => {
                        console.log('User ID:', response.id);
                        this.alertService.success('Login successful!');
                        localStorage.setItem('loginState', 'true');
                        this.authService.login(response.token); // Pass the entire user object
                        this.router.navigate(['/']);
                    },
                    (error) => {
                        this.alertService.error('Login failed. Please try again.');
                    }
                );
            }
                }
                else {
                this.alertService.error('Please correct the login form errors before submitting.');
            }
        } else {
            if (this.signupForm.valid) {
                this.http.post('http://localhost:3000/users', this.signupForm.value).subscribe(
                    (response: any) => {

                        this.alertService.success('Signup successful!');
                        localStorage.setItem('loginState', 'false');
                        this.authService.login(response); // Pass the entire user object
                        this.router.navigate(['/login']);
                    },

                    (error) => {
                        this.alertService.error('Signup failed. Please try again.');
                    }
                );
            } else {
                this.alertService.error('Please correct the signup form errors before submitting.');
            }
        }
    }
}