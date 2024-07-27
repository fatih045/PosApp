import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule]
})
export class CartComponent {
  @Input() cartItems: any[] = [];
  @Input() totalAmount: number = 0;

  @Output() increaseQuantity = new EventEmitter<any>();
  @Output() decreaseQuantity = new EventEmitter<any>();
  @Output() removeItem = new EventEmitter<any>();

  onIncreaseQuantity(cartItem: any) {
    this.increaseQuantity.emit(cartItem);
  }

  onDecreaseQuantity(cartItem: any) {
    this.decreaseQuantity.emit(cartItem);
  }

  onRemoveItem(cartItem: any) {
    this.removeItem.emit(cartItem);
  }
}
