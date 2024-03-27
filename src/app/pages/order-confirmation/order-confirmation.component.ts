import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  orderId!: string;
  orderDetails: any;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.getOrderDetails(this.orderId);
    });
  }

  getOrderDetails(orderId: string) {
    this.orderService.getOrderDetails(orderId).subscribe(
      (order: any) => {
        this.orderDetails = order;
      },
      (error: any) => {
        console.error('Error fetching order details:', error);
        // Handle error
      }
    );
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    for (const item of this.orderDetails.products) {
      subtotal += item.total_price;
    }
    return subtotal;
  }
  
}
