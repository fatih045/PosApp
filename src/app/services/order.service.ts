//
//
// import { Injectable } from '@angular/core';
// import PouchDB from 'pouchdb';
// import { Observable, from } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Order } from '../Model/Order';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {
//   private db: PouchDB.Database;
//   private remoteCouch:string;
//
//   constructor() {
//     const token = localStorage.getItem('token');
//     const password = localStorage.getItem('password');
//     const username = localStorage.getItem('user_id');
//
//      this.remoteCouch = `http://${token}:${password}@localhost:5984/orders`;
//
//     this.db = new PouchDB('orders');
//    this.syncWithRemote();
//   }
//
//
//   private syncWithRemote() {
//     this.db.sync(this.remoteCouch, {
//       live: true,
//       retry: true
//     }).on('change', (info) => {
//       this.updateOrderStatuses('Connected');
//     }).on('paused', (err) => {
//       this.updateOrderStatuses('Not Connected');
//     }).on('active', () => {
//       this.updateOrderStatuses('Connected');
//     }).on('error', (err) => {
//       this.updateOrderStatuses('Not Connected');
//     });
//   }
//
//   private async updateOrderStatuses(status: string) {
//     try {
//       const orders = await this.getAllOrders().toPromise();
//       if (orders && orders.length > 0) {
//         for (const order of orders) {
//           order.systemStatus = status;
//           await this.updateOrder(order);
//         }
//       }
//     } catch (error) {
//       console.error('Error updating order statuses:', error);
//     }
//   }
//
//
//
//
//
//
//
//
//
//
//
//
//
//   getAllOrders(): Observable<Order[]> {
//     return from(this.db.allDocs({ include_docs: true })).pipe(
//       map(result => result.rows.map(row => row.doc as Order)),
//       map(orders => orders || []) // orders değişkeni undefined ise boş dizi döner
//     );
//   }
//
//
//   // async addOrder(order: Order): Promise<void> {
//   //   try {
//   //     const response = await this.db.put(order);
//   //     console.log('Order added:', response);
//   //   } catch (error) {
//   //     console.error('Error adding order:', error);
//   //     throw error;
//   //   }
//   // }
//
//   async getOrderById(id: string): Promise<Order> {
//     try {
//       const order = await this.db.get(id);
//       return order as Order;
//     } catch (error) {
//       console.error('Error getting order by id:', error);
//       throw error;
//     }
//   }
//
//
//   async addOrder(order: Order) {
//     try {
//
//       if (order._id) {
//         return this.db.put(order);
//       }
//
//       return this.db.post(order);
//     } catch (error) {
//       throw new Error('Error adding order:' );
//     }
//   }
//
//   async updateOrder(order: Order) {
//     try {
//       return this.db.put(order);
//     } catch (error) {
//       throw new Error('Error adding order:' );
//       // throw new CustomPouchError('Error updating order: ' + error.message);
//     }
//   }
//
//
//
//
//
//
//
//
//
//
//   //
//   // async updateOrder(order: Order): Promise<void> {
//   //   try {
//   //     const existingOrder = await this.db.get(order._id);
//   //     order._rev = existingOrder._rev;  // En son revizyonu kullanarak güncelleme
//   //     const response = await this.db.put(order);
//   //     console.log('Order updated:', response);
//   //   } catch (error) {
//   //     console.error('Error updating order:', error);
//   //     throw error;
//   //   }}
//
//
//   async deleteOrder(id: string): Promise<any> {
//     try {
//       const order = await this.db.get(id);
//       const response = await this.db.remove(order);
//       return response;
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       throw error;
//     }
//   }
// }

import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../Model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private db: PouchDB.Database;
  private remoteCouch: string;
  private connectionStatus: string = 'Connected'; // Bağlantı durumu

  constructor() {
    const token = localStorage.getItem('token');
    const password = localStorage.getItem('password');
    const username = localStorage.getItem('user_id');

    this.remoteCouch = `http://${token}:${password}@localhost:5984/orders`;

    this.db = new PouchDB('orders');
    this.syncWithRemote();
  }

  private syncWithRemote() {
    this.db.sync(this.remoteCouch, {
      live: true,
      retry: true
    }).on('change', (info) => {
      this.updateOrderStatuses('Connected');
      this.connectionStatus = 'Connected';
    }).on('paused', (err) => {
      this.connectionStatus = 'Not Connected';
    }).on('active', () => {
      this.connectionStatus = 'Connected';
    }).on('error', (err) => {
      this.connectionStatus = 'Not Connected';
    });
  }

  private async updateOrderStatuses(status: string) {
    try {
      const orders = await this.db.allDocs({ include_docs: true });
      for (const row of orders.rows) {
        const order = row.doc as Order;
        if (order.systemStatus !== status) {
          order.systemStatus = status;
          await this.db.put(order);
        }
      }
    } catch (error) {
      console.error('Error updating order statuses:', error);
    }
  }

  getAllOrders(): Observable<Order[]> {
    return from(this.db.allDocs({ include_docs: true })).pipe(
      map(result => result.rows.map(row => row.doc as Order)),
      map(orders => orders || []) // orders değişkeni undefined ise boş dizi döner
    );
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const order = await this.db.get(id);
      return order as Order;
    } catch (error) {
      console.error('Error getting order by id:', error);
      throw error;
    }
  }

  async addOrder(order: Order) {
    try {
      order.systemStatus = this.connectionStatus;
      if (order._id) {
        return this.db.put(order);
      }
      return this.db.post(order);
    } catch (error) {
      throw new Error('Error adding order:' );
    }
  }

  async updateOrder(order: Order) {
    try {
      return this.db.put(order);
    } catch (error) {
      throw new Error('Error updating order:' );
    }
  }

  async deleteOrder(id: string): Promise<any> {
    try {
      const order = await this.db.get(id);
      const response = await this.db.remove(order);
      return response;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
}
