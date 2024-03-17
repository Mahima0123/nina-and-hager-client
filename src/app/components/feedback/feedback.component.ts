import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
    showFeedbackPopup: boolean = false;
    feedbackText: string = '';

    constructor(private http: HttpClient, private authService: AuthService, public alertService: AlertService){}

    toggleFeedbackPopup() {
        this.showFeedbackPopup = !this.showFeedbackPopup;
    }

    submitFeedback() {
      const userId = this.authService.getCurrentUser()?.id || 0;

      // HTTP POST request to submit feedback
      this.http.post<any>('http://localhost:3000/feedback', { user_id: userId, feedback_text: this.feedbackText })
          .subscribe(response => {
              this.alertService.success('Feedback submitted successfully.');
              this.feedbackText = '';
              // Close feedback popup or handle success feedback
          }, error => {
              this.alertService.error('Error submitting feedback');
          });
  }
}
