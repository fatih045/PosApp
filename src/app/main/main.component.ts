// main.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from '../table-list/table-list.component';
import { ProductTypesComponent } from '../product-types/product-types.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { CartComponent } from '../cart/cart.component';
import { ProductService } from '../services/product/product.service';
import { TableService } from '../services/table/table.service';
import { Product } from '../Model/Product';
import { ActivatedRoute } from '@angular/router';
import { ProductTypeService } from '../services/product-type/product-type.service';
import { OrderService } from '../services/order.service';
import { Order } from '../Model/Order';
import { SharedService } from '../shared.service';



@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [CommonModule, TableListComponent, ProductTypesComponent, ProductListComponent, CartComponent]
})
export class MainComponent implements OnInit {
  selectedTableId: string | null = null;
  selectedProductTypeId: string | null = null;
  tables: any[] = [];
  products: any[] = [];
  productTypes: any[] = [];
  filteredProducts: any[] = [];
  cartItems: any[] = [];
  totalPrice: number = 0;
  placeId: string = "place_1";
  orders: Order[] = []; // Siparişler için eklenen dizi
  
  constructor(private sharedService: SharedService,private route: ActivatedRoute, private productService: ProductService, private tableService: TableService, private productTypeService: ProductTypeService, private orderService: OrderService) {}

  async ngOnInit() {
    try {
      this.sharedService.currentPlaceId.subscribe(
        async curPlaceId => {
          this.productTypes = await this.productTypeService.getProductTypesByPlaceId(curPlaceId);
      this.products = await this.productService.getProductsByPlaceId(curPlaceId);
      this.tables = await this.tableService.getTablesByPlaceId(curPlaceId);
        }
      )
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
      alert('Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  onTableSelect(tableId: string) {
    this.selectedTableId = tableId;
    this.selectedProductTypeId = null;
    this.filteredProducts = [];
  }

  onProductTypeSelect(productTypeId: string) {
    this.selectedProductTypeId = productTypeId;
    this.filteredProducts = this.products.filter(p => p.product_type_id === productTypeId);
  }

  onProductSelect(product: Product) {
    const cartItem = this.cartItems.find(item => item.id === product.id);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
    this.totalPrice += product.price;
  }

  increaseCartItemQuantity(cartItem: any) {
    cartItem.quantity++;
    this.totalPrice += cartItem.price;
  }

  decreaseCartItemQuantity(cartItem: any) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this.totalPrice -= cartItem.price;
    }
  }

  removeCartItem(cartItem: any) {
    this.cartItems = this.cartItems.filter(item => item.id !== cartItem.id);
    this.totalPrice -= cartItem.quantity * cartItem.price;
  }

  backToTableSelection() {
    this.selectedTableId = null;
    this.selectedProductTypeId = null;
    this.filteredProducts = [];
  }

  async createOrder(paymentType: string) {
    const newOrder: Order = {
      _id: "", // generateId yerine "" kullanıldı
      id:"",
      type: 'order',
      table_id: this.selectedTableId!.toString(),
      date: new Date().toISOString(),
      products: this.cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price_per_unit: item.price
      })),
      total_price: this.totalPrice,
      status: paymentType === 'card' ? 'completed' : 'pending',
      user_id: '',
      place_id: this.placeId,
      
    };

    try {
      await this.orderService.addOrder(newOrder);

      this.orders.push(newOrder);
      // Sipariş eklendikten sonra sepeti temizleyin
      this.cartItems = [];
      this.totalPrice = 0;
      alert('Sipariş başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Sipariş oluşturulurken hata oluştu:', error);
      alert('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }
}
