import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {
  isLoginForm = true;
  loginForm: FormGroup;
  signupForm: FormGroup;
  alertMessage: string = ''; // To store and display alert messages

  alertType: 'success' | 'error' | 'warning' | 'info' | 'license' = 'success';
  alertLink: string | null = null;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, public alertService: AlertService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit() {
    this.alertService.getMessage().subscribe(message => {
      this.alertMessage = message.text;
      this.alertType = message.type;
      this.alertLink = message.link;
    });
  }

  toggleForm() {
    this.isLoginForm = !this.isLoginForm;
  }

  onSubmit() {
    this.alertService.hide(); // Hide  alert

    if (this.isLoginForm) {
      if (this.loginForm.valid) {
        this.http.post('http://localhost:3000/login', this.loginForm.value).subscribe(
          (response: any) => {
            // success message
            this.alertService.success('Login successful!');
            // login state in localStorage
            localStorage.setItem('loginState', 'true');
            // Redirect to the home page
            this.router.navigate(['/']);
          },
          (error) => {
            // error message
            this.alertService.error("Login failed. Please try again. ");
          }
        );
      } else {
        // Display an error message for validation errors
        this.alertService.error('Please correct the login form errors before submitting.');
      }
    } else {
      if (this.signupForm.valid) {
        this.http.post('http://localhost:3000/signup', this.signupForm.value).subscribe(
          (response: any) => {
            // success message
            this.alertService.success('Signup successful!');
            // login state in localStorage
            localStorage.setItem('loginState', 'false');
            this.router.navigate(['/login']); // Navigate to the login form
          },
          (error) => {
            // error message for signup failure
            this.alertService.error('Signup failed. Please try again.');
          }
        );
      } else {
        // error message for validation errors
        this.alertService.error('Please correct the signup form errors before submitting.');
      }
    }
  }
}