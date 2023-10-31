import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AlertService } from "./alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription;
  private showHideSubscription: Subscription = new Subscription;

  message: any;

  displayMessage: string = "";
  displayHeading: string = "";
  displayLink: string = "";
  

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      if (message) {
        this.message = message;
        switch (message.type) {
          case "success": {
            //statements;
            this.displayHeading = "Success !!!";
            break;
          }
          case "error": {
            //statements;
            this.displayHeading = "Error !!!";
            break;
          }
          case "warning": {
            //statements;
            this.displayHeading = "Warning !!!";
            break;
          }
          case "info": {
            //statements;
            this.displayHeading = "Information Alert!!!";
            break;
          }
          default: {
            //statements;
            break;
          }
        }
        this.displayMessage = message.text;
        this.displayLink= message.link;
        if (this.alertService.autoDisplay) this.show();
      }
    });

    this.showHideSubscription = this.alertService
      .getShowHide()
      .subscribe(isShow => {
        if (isShow) this.show();
        else this.hide();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.showHideSubscription.unsubscribe();
  }

  show() {
    this.alertService.show();
    if (this.alertService.autoDisplay) {
      setTimeout(() => {
        this.alertService.hide();
      }, 3000);
    }
  }

  hide() {
    this.close();
  }

  private close() {
    try {
      this.alertService.hide();
      this.alertService.autoDisplay = true;
      this.alertService.emitShowHideSubject.next();
    } catch (ex) {
    }
  }
}
