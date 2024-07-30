import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private localDB: any;
  private remoteDB: any;

  constructor() {
    this.localDB = new PouchDB('local_tables');
    this.remoteDB = new PouchDB('http://localhost:5984/tables', {
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

    // Create an index for place_id if it doesn't exist
    this.createPlaceIdIndex();
  }

  // Create an index for place_id
  private async createPlaceIdIndex() {
    try {
      await this.localDB.createIndex({
        index: { fields: ['place_id'] }
      });
      console.log('Index for place_id created');
    } catch (error) {
      console.error('Index creation error:', error);
    }
  }

  async getTableById(id: string): Promise<any> {
    try {
      const table = await this.localDB.get(id);
      console.log('Masa bulundu:', table);
      return table;
    } catch (error) {
      console.error('Masa bulma hatası:', error);
      throw error;
    }
  }

  async getAllTables(): Promise<any[]> {
    try {
      const result = await this.localDB.allDocs({ include_docs: true });
      const tables = result.rows.map((row: any) => row.doc);
      console.log('Tüm masalar:', tables);
      return tables;
    } catch (error) {
      console.error('Masaları getirme hatası:', error);
      throw error;
    }
  }

  // New method to get tables by place_id
  async getTablesByPlaceId(placeId: string): Promise<any[]> {
    try {
      const result = await this.localDB.find({
        selector: { place_id: placeId }
      });
      const tables = result.docs;
      console.log(`Masalar (place_id: ${placeId}):`, tables);
      return tables;
    } catch (error) {
      console.error('Masaları place_id ile getirme hatası:', error);
      throw error;
    }
  }
}
