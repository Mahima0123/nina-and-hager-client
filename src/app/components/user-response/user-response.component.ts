import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-user-response',
  templateUrl: './user-response.component.html',
  styleUrls: ['./user-response.component.css']
})
export class UserResponseComponent implements OnInit {
  feedbackList: any[] = []; // Array to store feedbacks
  displayedFeedbacks: any[] = []; // Array to store displayed feedbacks
  startIndex: number = 0;

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.feedbackService.getFeedbackWithUserNames().subscribe((feedbacks: any[]) => {
      this.feedbackList = feedbacks;
      this.updateDisplayedFeedbacks();
    });
  }

  slideLeft() {
    if (this.startIndex > 0) {
      this.startIndex--;
      this.updateDisplayedFeedbacks();
    }
  }

  slideRight() {
    if (this.startIndex + 4 < this.feedbackList.length) {
      this.startIndex++;
      this.updateDisplayedFeedbacks();
    }
  }

  updateDisplayedFeedbacks() {
    this.displayedFeedbacks = this.feedbackList.slice(this.startIndex, this.startIndex + 4);
  }


}
