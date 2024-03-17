import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user!: {
    name: string;
    email: string;
    phoneNumber: string;
    username: string;
  } | null;
  editing: boolean = false;
  originalUser: any;

  constructor(private authService: AuthService, public alertService: AlertService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.originalUser = { ...this.user };
    if (!this.user) {
      this.authService.fetchUserDetails();
    }
  }

  toggleEditMode() {
    this.editing = !this.editing;
    if (!this.editing) {
      this.user = { ...this.originalUser };
    }
  }

  saveChanges() {
    if (this.user) { // Ensure this.user is defined
      this.authService.updateUser(this.user).subscribe(
        (response: any) => {
          this.alertService.success('Data updated successfully.');
          this.originalUser = { ...this.user };
          this.editing = false;
        },
        (error: any) => {
          this.alertService.error('Error updating user');
        }
      );
    }
  }
}
