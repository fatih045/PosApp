import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind); // PouchDB-Find eklentisini PouchDB'ye dahil edin


@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  private db: PouchDB.Database;

  constructor() {
    const token = localStorage.getItem('token');
    const password = localStorage.getItem('password');
    const username = localStorage.getItem('user_id');

    const remoteCouch = `http://${token}:${password}@localhost:5984/product_types`;

    this.db = new PouchDB('product_types');
    this.db.sync(remoteCouch, {
      live: true,
      retry: true
    }).on('error', function (err) {
      console.log('Sync error:', err);
    });
  }



  async getProductTypesByPlaceId(placeTypeId: string): Promise<any[]> {
    try {
      const result = await this.db.find({
        selector: {
          place_id: placeTypeId
        }
      });
      const productTypes = result.docs;
      console.log(`Mekan tipi ID'sine göre ürün tipleri (${placeTypeId}):`, productTypes);
      return productTypes;
    } catch (error) {
      console.error(`Mekan tipi ID'sine göre ürün tiplerini getirme hatası (${placeTypeId}):`, error);
      throw error;
    }
  }
}
