import { Component, OnInit } from '@angular/core';
import { Order } from '../Model/Order';
import { OrderService } from '../services/order.service';
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
  newOrder: Order = {
    _id: '',
    type: 'order',
    table_id: '',
    date: new Date().toISOString(),
    items: [],
    total_amount: 0,
    status: 'pending'
  };
  selectedOrder: Order | null = null;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  async loadOrders() {
    try {
      this.orders = await this.orderService.getAllOrders();
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  async addNewOrder() {
    try {
      const response = await this.orderService.addOrder(this.newOrder);
      console.log('Order added:', response);
      this.newOrder = {
        _id: '',
        type: 'order',
        table_id: '',
        date: new Date().toISOString(),
        items: [],
        total_amount: 0,
        status: 'pending'
      };
      this.loadOrders();
    } catch (error) {
      console.error('Error adding order:', error);
    }
  }

  async updateSelectedOrder() {
    if (this.selectedOrder) {
      try {
        const response = await this.orderService.updateOrder(this.selectedOrder);
        console.log('Order updated:', response);
        this.selectedOrder = null;
        this.loadOrders();
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  }

  async deleteSelectedOrder() {
    if (this.selectedOrder) {
      try {
        const response = await this.orderService.deleteOrder(this.selectedOrder);
        console.log('Order deleted:', response);
        this.selectedOrder = null;
        this.loadOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  }

  updateOrder(order: Order) {
    this.selectedOrder = { ...order };
  }

  deleteOrder(order: Order) {
    this.selectedOrder = { ...order };
  }
}
