import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule]
})
export class ProductListComponent {
  @Input() products: any[] = [];
  @Output() addToCart = new EventEmitter<any>();

  onAddToCart(product: any) {
    this.addToCart.emit(product);
  }

  increaseQuantity(product: any) {
    product.quantity++;
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 0) {
      product.quantity--;
    }
  }
}
