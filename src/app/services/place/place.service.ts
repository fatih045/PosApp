import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private localDB: any;
  private remoteDB: any;

  constructor() {
    this.localDB = new PouchDB('local_places');
    this.remoteDB = new PouchDB('http://localhost:5984/places', {
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

  

  async getAllPlaces(): Promise<any[]> {
    try {
      const result = await this.localDB.allDocs({ include_docs: true });
      const places = result.rows.map((row: any) => row.doc);
      console.log('Tüm mekanlar:', places);
      return places;
    } catch (error) {
      console.error('Mekanları getirme hatası:', error);
      throw error;
    }
  }
  

}