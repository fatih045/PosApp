import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductType } from '../Model/ProductType';

@Component({
  selector: 'app-product-types',
  standalone: true,
  templateUrl: './product-types.component.html',
  styleUrls: ['./product-types.component.css'],
  imports: [CommonModule]
})
export class ProductTypesComponent {
  @Input() selectedProductTypeId: string | null = null;
  @Output() selectProductType = new EventEmitter<string>();

  @Input() productTypes: ProductType[] = [];

  onProductTypeSelect(productTypeId: string) {
    this.selectProductType.emit(productTypeId);
  }
}
