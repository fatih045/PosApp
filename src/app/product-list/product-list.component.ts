import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product/product.service';
import { Product } from '../Model/Product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule],
  providers: [ProductService]
})
export class ProductListComponent implements OnInit {
  @Input() products: Product[] = [];
  @Output() addToCart = new EventEmitter<any>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    //this.loadProducts();
  }
/*
  loadProducts(): void {
    this.productService.getAllProducts().then((data: Product[]) => {
      this.products = data;
    }).catch(error => {
      console.error('Error loading products:', error);
    });
  }*/

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
