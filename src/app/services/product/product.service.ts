import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private localDB: any;
  private remoteDB: any;

  constructor() {
    this.localDB = new PouchDB('local_products');
    this.remoteDB = new PouchDB('http://localhost:5984/products', {
      auth: {
        username: 'admin',
        password: '112233'
      }
    });

    this.localDB.sync(this.remoteDB, {
      live: true,
      retry: true
    }).on('change', (info: any) => {
      console.log('Senkronizasyon değişikliği:', info);
    }).on('paused', (err: any) => {
      console.log('Senkronizasyon durdu:', err);
    }).on('active', () => {
      console.log('Senkronizasyon yeniden başladı');
    }).on('denied', (err: any) => {
      console.error('Senkronizasyon erişim hatası:', err);
    }).on('complete', (info: any) => {
      console.log('Senkronizasyon tamamlandı:', info);
    }).on('error', (err: any) => {
      console.error('Senkronizasyon hatası:', err);
    });
  }

  async getProductById(id: string): Promise<any> {
    try {
      const product = await this.localDB.get(id);
      console.log('Ürün bulundu:', product);
      return product;
    } catch (error) {
      console.error('Ürün bulma hatası:', error);
      throw error;
    }
  }

  async getAllProducts(): Promise<any[]> {
    try {
      const result = await this.localDB.allDocs({ include_docs: true });
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
      const result = await this.localDB.find({
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
      const result = await this.localDB.find({
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
