import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  private localDB: any;
  private remoteDB: any;

  constructor() {
    this.localDB = new PouchDB('local_product_types');
    this.remoteDB = new PouchDB('http://localhost:5984/product_types', {
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

  async getProductTypesByPlaceId(placeTypeId: string): Promise<any[]> {
    try {
      const result = await this.localDB.find({
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
