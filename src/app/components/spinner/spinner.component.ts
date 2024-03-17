import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  showSpinner: boolean = false;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.subscription = this.spinnerService.getSpinnerState().subscribe((state) => {
      this.showSpinner = state;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
