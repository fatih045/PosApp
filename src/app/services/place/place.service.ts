import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind); // PouchDB-Find eklentisini PouchDB'ye dahil edin


@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private db: PouchDB.Database;

  constructor() {
    const token = localStorage.getItem('token');
    const password = localStorage.getItem('password');
    const username = localStorage.getItem('user_id');

    const remoteCouch = `http://${token}:${password}@localhost:5984/places`;

    this.db = new PouchDB('places');
    this.db.sync(remoteCouch, {
      live: true,
      retry: true
    }).on('error', function (err) {
      console.log('Sync error:', err);
    });
  }


  

  async getAllPlaces(): Promise<any[]> {
    try {
      const result = await this.db.find({
        selector: {
          type: "place"
        } 
        });
      const places = result.docs;
      console.log('Tüm mekanlar:', places);
      return places;
    } catch (error) {
      console.error('Mekanları getirme hatası:', error);
      throw error;
    }
  }
  

}