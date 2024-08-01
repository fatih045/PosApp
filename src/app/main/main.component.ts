// // main.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TableListComponent } from '../table-list/table-list.component';
// import { ProductTypesComponent } from '../product-types/product-types.component';
// import { ProductListComponent } from '../product-list/product-list.component';
// import { CartComponent } from '../cart/cart.component';
// import { OrderComponent } from '../order/order.component';
// import { ProductService } from '../services/product/product.service';
// import { TableService } from '../services/table/table.service';
// import { Product } from '../Model/Product';
// import { ActivatedRoute } from '@angular/router';
// import { ProductTypeService } from '../services/product-type/product-type.service';
// import { OrderService } from '../services/order.service';
// import { Order } from '../Model/Order';
// import { SharedService } from '../shared.service';
// import {MatTabsModule} from '@angular/material/tabs';
//
//
//
// @Component({
//   selector: 'app-main',
//   standalone: true,
//   templateUrl: './main.component.html',
//   styleUrls: ['./main.component.css'],
//   imports: [CommonModule, TableListComponent, ProductTypesComponent, ProductListComponent, CartComponent,OrderComponent,MatTabsModule]
// })
// export class MainComponent implements OnInit {
//   selectedTabIndex: number = 0;
//   selectedTableId: string | null = null;
//   selectedProductTypeId: string | null = null;
//   tables: any[] = [];
//   products: any[] = [];
//   productTypes: any[] = [];
//   filteredProducts: any[] = [];
//   cartItems: any[] = [];
//   totalPrice: number = 0;
//   placeId: string = "place_1";
//   orders: Order[] = []; // Siparişler için eklenen dizi
//   orderData: Order | null = null; // Yeni değişken
//
//   constructor(private sharedService: SharedService,private route: ActivatedRoute, private productService: ProductService, private tableService: TableService, private productTypeService: ProductTypeService, private orderService: OrderService) {}
//
//   async ngOnInit() {
//     try {
//       this.sharedService.currentPlaceId.subscribe(
//         async curPlaceId => {
//           this.productTypes = await this.productTypeService.getProductTypesByPlaceId(curPlaceId);
//       this.products = await this.productService.getProductsByPlaceId(curPlaceId);
//       this.tables = await this.tableService.getTablesByPlaceId(curPlaceId);
//         }
//       )
//     } catch (error) {
//       console.error('Veriler yüklenirken hata oluştu:', error);
//       alert('Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
//     }
//   }
//   onTabChange(event: any) {
//     this.selectedTabIndex = event.index;
//   }
//
//
//   onTableSelect(tableId: string) {
//     this.selectedTableId = tableId;
//     this.selectedProductTypeId = null;
//     this.filteredProducts = [];
//   }
//
//   onProductTypeSelect(productTypeId: string) {
//     this.selectedProductTypeId = productTypeId;
//     this.filteredProducts = this.products.filter(p => p.product_type_id === productTypeId);
//   }
//
//   onProductSelect(product: Product) {
//     const cartItem = this.cartItems.find(item => item.id === product.id);
//     if (cartItem) {
//       cartItem.quantity += 1;
//     } else {
//       this.cartItems.push({ ...product, quantity: 1 });
//     }
//     this.totalPrice += product.price;
//   }
//
//   increaseCartItemQuantity(cartItem: any) {
//     cartItem.quantity++;
//     this.totalPrice += cartItem.price;
//   }
//
//   decreaseCartItemQuantity(cartItem: any) {
//     if (cartItem.quantity > 1) {
//       cartItem.quantity--;
//       this.totalPrice -= cartItem.price;
//     }
//   }
//
//   removeCartItem(cartItem: any) {
//     this.cartItems = this.cartItems.filter(item => item.id !== cartItem.id);
//     this.totalPrice -= cartItem.quantity * cartItem.price;
//   }
//
//   backToTableSelection() {
//     this.selectedTableId = null;
//     this.selectedProductTypeId = null;
//     this.filteredProducts = [];
//   }
//
//   async createOrder(paymentType: string) {
//     const newOrder: Order = {
//       _id: "", // generateId yerine "" kullanıldı
//       id:"",
//       type: 'order',
//       table_id: this.selectedTableId!.toString(),
//       date: new Date().toISOString(),
//       products: this.cartItems.map(item => ({
//         id: item.id,
//         name: item.name,
//         quantity: item.quantity,
//         per_price: item.price
//       })),
//       total_price: this.totalPrice,
//       status: paymentType === 'card' ? 'completed' : 'pending',
//       user_id: localStorage.getItem('user_id') || '',
//       place_id: this.placeId,
//
//     };
//
//   console.log(`Kullanıcı ID: ${localStorage.getItem('user_id')}`);
//
//     try {
//       await this.orderService.addOrder(newOrder);
//
//       this.orders.push(newOrder);
//       // Sipariş eklendikten sonra sepeti temizleyin
//       this.cartItems = [];
//       this.totalPrice = 0;
//       alert('Sipariş başarıyla oluşturuldu!');
//     } catch (error) {
//       console.error('Sipariş oluşturulurken hata oluştu:', error);
//       alert('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from '../table-list/table-list.component';
import { ProductTypesComponent } from '../product-types/product-types.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { CartComponent } from '../cart/cart.component';
import { OrderComponent } from '../order/order.component';
import { ProductService } from '../services/product/product.service';
import { TableService } from '../services/table/table.service';
import { Product } from '../Model/Product';
import {ActivatedRoute, Router} from '@angular/router';
import { ProductTypeService } from '../services/product-type/product-type.service';
import { OrderService } from '../services/order.service';
import { Order } from '../Model/Order';
import { SharedService } from '../shared.service';
import { MatTabsModule } from '@angular/material/tabs';
import {routes} from "../app.routes";

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [CommonModule, TableListComponent, ProductTypesComponent, ProductListComponent, CartComponent, OrderComponent, MatTabsModule]
})
export class MainComponent implements OnInit {
  selectedTabIndex: number = 0;
  selectedTableId: string | null = null;
  selectedProductTypeId: string | null = null;
  tables: any[] = [];
  products: any[] = [];
  productTypes: any[] = [];
  filteredProducts: any[] = [];
  cartItems: any[] = [];
  totalPrice: number = 0;
  placeId: string = "place_1";
  orders: Order[] = [];
  orderData: Order | null = null;

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private tableService: TableService,
    private productTypeService: ProductTypeService,
    private orderService: OrderService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      this.sharedService.currentPlaceId.subscribe(
        async curPlaceId => {
          this.productTypes = await this.productTypeService.getProductTypesByPlaceId(curPlaceId);
          this.products = await this.productService.getProductsByPlaceId(curPlaceId);
          this.tables = await this.tableService.getTablesByPlaceId(curPlaceId);
        }
      );

      this.sharedService.currentOrderData.subscribe(orderData => {
        if (orderData) {
          this.orderData = orderData;
          this.selectedTabIndex = 0; // Ana sayfaya yönlendirme
          this.selectedTableId = orderData.table_id;
          this.cartItems = orderData.products.map(product => ({
            ...product,
            id: product.id,
            price: product.per_price,
            quantity: product.quantity
          }));
          this.totalPrice = orderData.total_price;
        }
      });
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
      alert('Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
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

  // async createOrder(paymentType: string) {
  //   const newOrder: Order = {
  //     _id: this.orderData ? this.orderData._id : "", // Var olan siparişi güncelleme için ID
  //     id: this.orderData ? this.orderData.id : "",
  //     type: 'order',
  //     table_id: this.selectedTableId!.toString(),
  //     date: new Date().toISOString(),
  //     products: this.cartItems.map(item => ({
  //       id: item.id,
  //       name: item.name,
  //       quantity: item.quantity,
  //       per_price: item.price
  //     })),
  //     total_price: this.totalPrice,
  //     status: paymentType === 'card' ? 'completed' : 'pending',
  //     user_id: localStorage.getItem('user_id') || '',
  //     place_id: this.placeId,
  //   };
  //
  //   console.log(`Kullanıcı ID: ${localStorage.getItem('user_id')}`);
  //
  //   try {
  //     if (this.orderData) {
  //       await this.orderService.updateOrder(newOrder);
  //       alert('Sipariş başarıyla güncellendi!');
  //     } else {
  //       await this.orderService.addOrder(newOrder);
  //       this.orders.push(newOrder);
  //       alert('Sipariş başarıyla oluşturuldu!');
  //     }
  //     this.cartItems = [];
  //     this.totalPrice = 0;
  //   } catch (error) {
  //     console.error('Sipariş oluşturulurken/güncellenirken hata oluştu:', error);
  //     alert('Sipariş oluşturulurken/güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
  //   }
  // }


  async createOrder(paymentType: string) {
    const newOrder: Order = {
      _id: this.orderData ? this.orderData._id : "",
      id: this.orderData ? this.orderData.id : "",
      type: 'order',
      table_id: this.selectedTableId!.toString(),
      date: new Date().toISOString(),
      products: this.cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        per_price: item.price
      })),
      total_price: this.totalPrice,
      status: paymentType === 'card' ? 'completed' : 'pending',
      user_id: localStorage.getItem('user_id') || '',
      place_id: this.placeId,
    };

    console.log(`Kullanıcı ID: ${localStorage.getItem('user_id')}`);

    try {
      if (this.orderData) {
        const currentOrder = await this.orderService.getOrderById(this.orderData._id);
        newOrder._rev = currentOrder._rev; // En güncel revizyon numarasını ekle

        await this.orderService.updateOrder(newOrder);
        alert('Sipariş başarıyla güncellendi!');
        await this.router.navigate(['/order']);
      } else {
        await this.orderService.addOrder(newOrder);
        this.orders.push(newOrder);
        alert('Sipariş başarıyla oluşturuldu!');
      }
      this.cartItems = [];
      this.totalPrice = 0;
    } catch (error) {
      if (error instanceof Error) { // TypeScript hata türünü kontrol eder
        if (error.name === 'conflict') {
          alert('Belge güncellenirken çakışma oluştu. Lütfen tekrar deneyin.');
        } else {
          console.error('Sipariş oluşturulurken/güncellenirken hata oluştu:', error);
          alert('Sipariş oluşturulurken/güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } else {
        console.error('Bilinmeyen hata oluştu:', error);
        alert('Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  }




  // async createOrder(paymentType: string) {
  //   const newOrder: Order = {
  //     _id: this.orderData ? this.orderData._id : "", // Var olan siparişi güncelleme için ID
  //     id: this.orderData ? this.orderData.id : "",
  //     type: 'order',
  //     table_id: this.selectedTableId!.toString(),
  //     date: new Date().toISOString(),
  //     products: this.cartItems.map(item => ({
  //       id: item.id,
  //       name: item.name,
  //       quantity: item.quantity,
  //       per_price: item.price
  //     })),
  //     total_price: this.totalPrice,
  //     status: paymentType === 'card' ? 'completed' : 'pending',
  //     user_id: localStorage.getItem('user_id') || '',
  //     place_id: this.placeId,
  //   };
  //
  //   console.log(`Kullanıcı ID: ${localStorage.getItem('user_id')}`);
  //
  //   try {
  //     if (this.orderData) {
  //       await this.orderService.updateOrder(newOrder);
  //       alert('Sipariş başarıyla güncellendi!');
  //       await this.router.navigate(['/order']);
  //
  //     } else {
  //       await this.orderService.addOrder(newOrder);
  //       this.orders.push(newOrder);
  //       alert('Sipariş başarıyla oluşturuldu!');
  //     }
  //     this.cartItems = [];
  //     this.totalPrice = 0;
  //   } catch (error) {
  //     console.error('Sipariş oluşturulurken/güncellenirken hata oluştu:', error);
  //     alert('Sipariş oluşturulurken/güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
  //   }
  // }


}
