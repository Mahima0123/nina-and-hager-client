// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, throwError } from 'rxjs';
import { AlertService } from '../components/alert/alert.service';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public isLoggedInSubject = new BehaviorSubject<boolean>(false);
    isLoggedIn$ = this.isLoggedInSubject.asObservable();
    private currentUser: {
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
        username: string;
    } | null = null;

    constructor(private jwtHelper: JwtHelperService, private http: HttpClient, public alertService: AlertService) {
        this.initializeLoginState();
    }

    private initializeLoginState() {
        console.log('Initializing login state');
        const savedToken = localStorage.getItem('token');

        if (savedToken && !this.jwtHelper.isTokenExpired(savedToken)) {
            // Token is valid, user is logged in
            this.isLoggedInSubject.next(true);
            // Decode token to get user details if needed
            const decodedToken = this.jwtHelper.decodeToken(savedToken);
            console.log('decoded ID: ', decodedToken.id);
            this.currentUser = {
                id: decodedToken.id,
                name: decodedToken.name,
                email: decodedToken.email,
                phoneNumber: decodedToken.phoneNumber,
                username: decodedToken.sub,
            };
        }
    }

    login(token: string | null): void {
        if (token) {
            // For both user and admin login with a token from the server
            localStorage.setItem('token', token);
    
            //fetch user details after successful login
            this.fetchUserDetails();
        }
    
        this.isLoggedInSubject.next(true); // setting true for both cases
    }

    logout(): void {
        console.log('Logging out');
        this.isLoggedInSubject.next(false);
        this.currentUser = null;
        localStorage.removeItem('token');
    }

    isLoggedInUser(): boolean {
        return this.isLoggedInSubject.value;
    }

    getCurrentUser(): {
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
        username: string;
    } | null {
        return this.currentUser; // Assuming currentUser is the object containing user details including the user ID
    }

    public fetchUserDetails(): void {
        const savedToken = localStorage.getItem('token');
    
        if (savedToken && !this.jwtHelper.isTokenExpired(savedToken)) {
            const decodedToken = this.jwtHelper.decodeToken(savedToken);
            const username = decodedToken.sub; // Assuming sub contains the username in the decoded token
    
            this.http.get(`http://localhost:3000/users/${username}`).subscribe(
                (response: any) => {
                    // Assuming the server returns the user details including the ID
                    this.currentUser = {
                        id: response.id,
                        name: response.name,
                        email: response.email,
                        phoneNumber: response.phoneNumber, // Corrected property name
                        username: response.sub, // Corrected property name
                    };
                },
                (error: any) => {
                    this.alertService.error('Error fetching user details');
                }
            );
        }
    }
    
    updateUser(user: any) {
        const savedToken = localStorage.getItem('token');
        if (savedToken && !this.jwtHelper.isTokenExpired(savedToken)) {
            return this.http.put(`http://localhost:3000/users/${user.username}`, user);
        } else {
            return throwError('Token expired or not present');
        }
    }

    setCurrentUser(user: any): void {
        this.currentUser = user;
        // Store user data in local storage if needed
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
}