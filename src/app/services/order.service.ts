
import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { Order } from '../Model/Order';

PouchDB.plugin(PouchDBFind);

// CouchDB kimlik bilgileri
const username = 'admin';
const password = '112233';
const remoteDbUrl = `http://${username}:${password}@localhost:5984/orders`;

const localDb = new PouchDB('orders');
const remoteDb = new PouchDB(remoteDbUrl);

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() {
    localDb.sync(remoteDb, {
      live: true,
      retry: true
    }).on('change', (info) => {
      console.log('Sync change:', info);
    }).on('paused', (err) => {
      if (err) {
        console.error('Sync paused:', err);
      }
    }).on('active', () => {
      console.log('Sync active');
    }).on('denied', (err) => {
      console.error('Sync denied:', err);
    }).on('error', (err) => {
      console.error('Sync error:', err);
    });
  }

  async addOrder(order: Order): Promise<any> {
    try {
      const response = await localDb.post(order);
      return response;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  }

  async updateOrder(order: Order): Promise<any> {
    try {
      if (!order._id) {
        throw new Error('Order must have an _id for update');
      }
      const existingOrder = await localDb.get(order._id);
      order._rev = existingOrder._rev;
      const response = await localDb.put(order);
      return response;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(order: Order): Promise<any> {
    if (!order._id || !order._rev) {
      throw new Error('Order must have both _id and _rev for deletion');
    }
    try {
      const response = await localDb.remove(order._id, order._rev);
      return response;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const order = await localDb.get(id);
      return order as Order;
    } catch (error) {
      console.error('Error getting order by id:', error);
      throw error;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const result = await localDb.allDocs({ include_docs: true });
      return result.rows.map(row => row.doc as Order);
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }
}
