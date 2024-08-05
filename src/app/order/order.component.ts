

import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../Model/Order';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import {SharedService} from "../shared.service";

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

  constructor(private orderService: OrderService, private router: Router, private sharedService: SharedService) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data;
      console.log('Fetched orders:', this.orders);
    }, error => {
      console.error('Error fetching orders:', error);
    });
  }

  editOrder(order: Order) {

    this.sharedService.setOrderData(order);
    this.router.navigate(['/main']);
  }


  deleteOrder(id: string) {
    if (confirm('Siparişi silmek istediğinizden emin misiniz?')) {
      this.orderService.deleteOrder(id).then(() => {
        this.orders = this.orders.filter(order => order._id !== id);
        alert('Sipariş başarıyla silindi!');
      }).catch(error => {
        console.error('Sipariş silinirken hata oluştu:', error);
        alert('Sipariş silinirken bir hata oluştu. Lütfen tekrar deneyin.');
      });
    }
  }
}
