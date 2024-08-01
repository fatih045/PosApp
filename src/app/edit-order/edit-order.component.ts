import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../Model/Order';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(orderId).then(order => {
        this.order = order;
      }).catch(error => {
        console.error('Error fetching order:', error);
      });
    }
  }

  updateOrder() {
    if (this.order) {
      this.orderService.updateOrder(this.order).then(() => {
        alert('Sipariş başarıyla güncellendi!');
        this.router.navigate(['/order']);
      }).catch(error => {
        console.error('Sipariş güncellenirken hata oluştu:', error);
        alert('Sipariş güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      });
    }
  }
}
