import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from '../table-list/table-list.component';
import { ProductTypesComponent } from '../product-types/product-types.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [CommonModule, TableListComponent, ProductTypesComponent, ProductListComponent, CartComponent]
})
export class MainComponent {
  selectedTable: number | null = null;
  selectedProductType: number | null = null;
  products = [
    { id: 1, type: 1, name: 'Product 1', price: 100, quantity: 0 },
    { id: 2, type: 1, name: 'Product 2', price: 200, quantity: 0 },
    { id: 3, type: 2, name: 'Product 3', price: 150, quantity: 0 },
    { id: 4, type: 2, name: 'Product 4', price: 250, quantity: 0 },
    { id: 5, type: 3, name: 'Product 5', price: 300, quantity: 0 },
    { id: 6, type: 3, name: 'Product 6', price: 400, quantity: 0 }
  ];
  filteredProducts: any[] = [];
  cartItems: any[] = [];
  totalAmount: number = 0;

  onTableSelect(tableId: number) {
    this.selectedTable = tableId;
    this.selectedProductType = null;
    this.filteredProducts = [];
  }

  onProductTypeSelect(productTypeId: number) {
    this.selectedProductType = productTypeId;
    this.filteredProducts = this.products.filter(p => p.type === productTypeId);
  }

  onProductSelect(product: any) {
    const cartItem = this.cartItems.find(item => item.id === product.id);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
    this.totalAmount += product.price;
  }

  increaseCartItemQuantity(cartItem: any) {
    cartItem.quantity++;
    this.totalAmount += cartItem.price;
  }

  decreaseCartItemQuantity(cartItem: any) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this.totalAmount -= cartItem.price;
    }
  }

  removeCartItem(cartItem: any) {
    this.cartItems = this.cartItems.filter(item => item.id !== cartItem.id);
    this.totalAmount -= cartItem.quantity * cartItem.price;
  }

  backToTableSelection() {
    this.selectedTable = null;
    this.selectedProductType = null;
    this.filteredProducts = [];
  }
}
