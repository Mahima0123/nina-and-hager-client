import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/components/alert/alert.service';
import { Chart, registerables } from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('barCanvas', { static: true }) barCanvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('pieCanvas', { static: true }) pieCanvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('lineCanvas', { static: true }) lineCanvas: ElementRef<HTMLCanvasElement> | undefined;
  isLoggedIn: boolean = false;
  currentDate: Date = new Date();
  currentTab: string = 'dashboard'; // the default active tab

  private subscriptions: Subscription[] = [];

  totalIncome: number = 11000;
  totalExpenses: number = 22000;

  rectangularBoxes = [
    { label: 'Total Users', value: '100', color: 'color-blue', icon: '../../../../../assets/images/user.png' },
    { label: 'Total Income', value: 'Rs. 11,000', color: 'color-brown', icon: '../../../../../assets/images/income.png' },
    { label: 'Total Expenses', value: 'Rs. 22,000', color: 'color-green', icon: '../../../../../assets/images/expense.png' },
    { label: 'Cash At Bank', value: '100', color: 'color-pink', icon: '../../../../../assets/images/bank.png' },
    { label: 'Cash In Hand', value: 'Rs. 11,000', color: 'color-yellow', icon: '../../../../../assets/images/hand.png' },
    { label: 'Products Sold', value: '35', color: 'color-blue', icon: '../../../../../assets/images/products.png' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    public alertService: AlertService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    const authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      }
    );
    this.subscriptions.push(authSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngAfterViewInit() {
    if (this.barCanvas) {
      this.initializeBarChart();
    }

    if (this.pieCanvas) {
      this.initializePieChart();
    }

    if (this.lineCanvas) {
      this.initializeLineChart();
    }
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

  // Bar-graph
  private initializeBarChart() {
    const barCanvas = this.barCanvas?.nativeElement;
    const barCtx = barCanvas?.getContext('2d');

    if (!barCtx) {
      console.error('Failed to get canvas context');
      return;
    }

    Chart.register(...registerables);

    const barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Total Income', 'Total Expense'],
        datasets: [
          {
            label: 'Amount (Rs.)',
            data: [this.totalIncome, this.totalExpenses],
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Pie-chart
  private initializePieChart() {
    const pieCanvas = this.pieCanvas?.nativeElement;
    const pieCtx = pieCanvas?.getContext('2d');

    if (!pieCtx) {
      console.error('Failed to get canvas context');
      return;
    }

    Chart.register(...registerables);

    const pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Total Income', 'Total Expense'],
        datasets: [
          {
            data: [this.totalIncome, this.totalExpenses],
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderWidth: 1
          }
        ]
      }
    });
  }

  // Line-chart
  private initializeLineChart() {
    const lineCanvas = this.lineCanvas?.nativeElement;
    const lineCtx = lineCanvas?.getContext('2d');

    if (!lineCtx) {
      console.error('Failed to get canvas context');
      return;
    }

    Chart.register(...registerables);

    const lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Products Sold',
            data: [10, 12, 9, 10, 14, 12, 18, 19, 25, 30, 20, 21],
            borderColor: '#FF5733',
            borderWidth: 2,
            fill: false
          }
        ]
      }
    });
  }
}
