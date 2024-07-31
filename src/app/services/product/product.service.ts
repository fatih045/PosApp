import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind); // PouchDB-Find eklentisini PouchDB'ye dahil edin


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private db: PouchDB.Database;

  constructor() {
    const token = localStorage.getItem('token');
    const password = localStorage.getItem('password');
    const username = localStorage.getItem('user_id');

    const remoteCouch = `http://${token}:${password}@localhost:5984/products`;

    this.db = new PouchDB('products');
    this.db.sync(remoteCouch, {
      live: true,
      retry: true
    }).on('error', function (err) {
      console.log('Sync error:', err);
    });
  }

  async getProductById(id: string): Promise<any> {
    try {
      const product = await this.db.get(id);
      console.log('Ürün bulundu:', product);
      return product;
    } catch (error) {
      console.error('Ürün bulma hatası:', error);
      throw error;
    }
  }

  async getAllProducts(): Promise<any[]> {
    try {
      const result = await this.db.allDocs({ include_docs: true });
      const products = result.rows.map((row: any) => row.doc);
      console.log('Tüm ürünler:', products);
      return products;
    } catch (error) {
      console.error('Ürünleri getirme hatası:', error);
      throw error;
    }
  }
  

  async getProductsByPlaceId(placeId: string): Promise<any[]> {
    try {
      const result = await this.db.find({
        selector: {
          place_id: placeId
        }
      });
      const products = result.docs;
      console.log(`Mekan ID'sine göre ürünler (${placeId}):`, products);
      return products;
    } catch (error) {
      console.error(`Mekan ID'sine göre ürünleri getirme hatası (${placeId}):`, error);
      throw error;
    }
  }

  

  async getProductsByProductTypeId(productTypeId: number): Promise<any[]> {
    try {
      const result = await this.db.find({
        selector: {
          product_type_id: productTypeId
        }
      });
      const products = result.docs;
      console.log(`Ürün tipi ID'sine göre ürünler (${productTypeId}):`, products);
      return products;
    } catch (error) {
      console.error(`Ürün tipi ID'sine göre ürünleri getirme hatası (${productTypeId}):`, error);
      throw error;
    }
  }
}
