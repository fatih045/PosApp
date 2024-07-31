import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind); // PouchDB-Find eklentisini PouchDB'ye dahil edin


@Injectable({
  providedIn: 'root'
})
export class TableService {
  private db: PouchDB.Database;

  constructor() {
    const token = localStorage.getItem('token');
    const password = localStorage.getItem('password');
    const username = localStorage.getItem('user_id');

    const remoteCouch = `http://${token}:${password}@localhost:5984/tables`;

    this.db = new PouchDB('tables');
    this.db.sync(remoteCouch, {
      live: true,
      retry: true
    }).on('error', function (err) {
      console.log('Sync error:', err);
    });
  


    // Create an index for place_id if it doesn't exist
    this.createPlaceIdIndex();
  }

  // Create an index for place_id
  private async createPlaceIdIndex() {
    try {
      await this.db.createIndex({
        index: { fields: ['place_id'] }
      });
      console.log('Index for place_id created');
    } catch (error) {
      console.error('Index creation error:', error);
    }
  }

  async getTableById(id: string): Promise<any> {
    try {
      const table = await this.db.get(id);
      console.log('Masa bulundu:', table);
      return table;
    } catch (error) {
      console.error('Masa bulma hatası:', error);
      throw error;
    }
  }

  async getAllTables(): Promise<any[]> {
    try {
      const result = await this.db.allDocs({ include_docs: true });
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
      const result = await this.db.find({
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
