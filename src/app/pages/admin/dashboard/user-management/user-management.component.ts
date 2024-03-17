// user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  isLoggedIn: boolean = false;
  currentDate: Date = new Date();
  currentTab: string = 'dashboard';
  users: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    public alertService: AlertService,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    const authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      }
    );

    // Fetch users from the backend when the component initializes
    this.fetchUsers();
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

  // Fetch users function
  fetchUsers(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  // Method to delete a user with confirmation
  deleteUser(user: any, index: number): void {
    const userId = user.id;

    if (userId !== undefined && userId !== null) {
      // Ask for confirmation before deleting
      const confirmed = window.confirm('Are you sure you want to delete this user?');

      if (confirmed) {
        // Send a request to delete the user by ID
        this.userService.deleteUser(userId).subscribe(
          () => {
            // Update the local array or fetch users again from the server
            this.fetchUsers();
          },
          (error) => {
            this.alertService.error(error.message);
          }
        );
      }
    } else {
      console.error('Invalid userId:', userId);
    }
  }
}