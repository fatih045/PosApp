import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../Model/Order'; // Order arayüzünü import ettik
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    CurrencyPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data.rows.map((row: any) => row.doc);
      console.log('Fetched orders:', this.orders); // Debug için verileri loglayalım
    }, error => {
      console.error('Error fetching orders:', error);
    });
  }
}
