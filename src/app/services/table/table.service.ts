import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

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
}
