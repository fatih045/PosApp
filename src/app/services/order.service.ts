// import { Injectable } from '@angular/core';
// import PouchDB from 'pouchdb';
// import { Observable, from } from 'rxjs';
// import { Order } from '../Model/Order'; // Order arayüzünü import ettik
//
// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {
//   private db: PouchDB.Database;
//
//   constructor() {
//     const token = localStorage.getItem('token');
//     const password = localStorage.getItem('password');
//     const username = localStorage.getItem('user_id');
//
//     const remoteCouch = `http://${token}:${password}@localhost:5984/orders`;
//
//     this.db = new PouchDB('orders');
//     this.db.sync(remoteCouch, {
//       live: true,
//       retry: true
//     }).on('error', function (err) {
//       console.log('Sync error:', err);
//     });
//   }
//
//   getAllOrders(): Observable<any> {
//     return from(this.db.allDocs({ include_docs: true }));
//   }
//   async addOrder(order: Order): Promise<any> {
//     try {
//       const response = await this.db.post(order);
//       return response;
//     } catch (error) {
//       console.error('Error adding order:', error);
//       throw error;
//     }
//   }
// }
//

import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../Model/Order'; // Order arayüzünü import ettik

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private db: PouchDB.Database;

  constructor() {
    const token = localStorage.getItem('token');
    const password = localStorage.getItem('password');
    const username = localStorage.getItem('user_id');

    const remoteCouch = `http://${token}:${password}@localhost:5984/orders`;

    this.db = new PouchDB('orders');
    this.db.sync(remoteCouch, {
      live: true,
      retry: true
    }).on('error', function (err) {
      console.log('Sync error:', err);
    });
  }

  getAllOrders(): Observable<Order[]> {
    return from(this.db.allDocs({ include_docs: true })).pipe(
      map(result => result.rows.map(row => row.doc as Order))
    );
  }

  async addOrder(order: Order): Promise<any> {
    try {
      const response = await this.db.post(order);
      return response;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
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

  async updateOrder(order: Order): Promise<any> {
    try {
      const response = await this.db.put(order);
      return response;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
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
