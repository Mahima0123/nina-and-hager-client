// alert.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  message: any;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe((message) => {
      this.message = message;
      if (message) {
        setTimeout(() => {
          this.alertService.clearMessage();
        }, 3000);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
