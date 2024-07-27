import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-types',
  standalone: true,
  templateUrl: './product-types.component.html',
  styleUrls: ['./product-types.component.css'],
  imports: [CommonModule]
})
export class ProductTypesComponent {
  @Input() selectedProductType: number | null = null;
  @Output() selectProductType = new EventEmitter<number>();

  productTypes = [
    { id: 1, name: 'Type 1', amount: 15 },
    { id: 2, name: 'Type 2', amount: 18 },
    { id: 3, name: 'Type 3', amount: 20 }
    // Diğer ürün tipleri
  ];

  onProductTypeSelect(productTypeId: number) {
    this.selectProductType.emit(productTypeId);
  }
}
