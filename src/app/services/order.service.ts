import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { Observable, from } from 'rxjs';
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

  getAllOrders(): Observable<any> {
    return from(this.db.allDocs({ include_docs: true }));
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
}

