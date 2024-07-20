import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private localDB: any;
  private remoteDB: any;
  private sessionDB: any;

  constructor() {
    PouchDB.plugin(PouchDBFind);

    // Yerel PouchDB veritabanı
    this.localDB = new PouchDB('local_users');

    // Oturum bilgilerini saklamak için ayrı bir yerel veritabanı
    this.sessionDB = new PouchDB('local_sessions');

    // Uzak CouchDB veritabanı (kullanıcı bilgileri için)
    this.remoteDB = new PouchDB('http://localhost:5984/_users', {
      auth: {
        username: 'admin',
        password: '112233'
      }
    });

    // Senkronizasyon (İki yönlü)
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

  async register(userInfo: { username: string, password: string, firstName: string, lastName: string, hireDate: string }): Promise<any> {
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const iterations = 10000;
    const derivedKey = CryptoJS.PBKDF2(userInfo.password, salt, { keySize: 512 / 32, iterations: iterations }).toString();

    const userDoc = {
      _id: 'org.couchdb.user:' + userInfo.username, // Kullanıcı dokümanı için uygun ID formatı
      name: userInfo.username,
      roles: [],
      type: 'user',
      password_scheme: 'pbkdf2',
      iterations: iterations,
      derived_key: derivedKey,
      salt: salt,
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      hireDate: userInfo.hireDate
    };

    try {
      const response = await this.remoteDB.put(userDoc);
      console.log('Kullanıcı uzak veritabanına kaydedildi:', response);
      return response;
    } catch (error) {
      console.error('Kullanıcı kaydı hatası:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<any> {
    try {
      const result = await this.remoteDB.find({
        selector: { username: username }
      });

      if (result.docs.length === 0) {
        throw new Error('Kullanıcı bulunamadı');
      }

      const user = result.docs[0];
      if (!user.derived_key || !user.salt) {
        throw new Error('Kullanıcı parolası bulunamadı');
      }

      const derivedKey = CryptoJS.PBKDF2(password, user.salt, { keySize: 512 / 32, iterations: user.iterations }).toString();

      if (derivedKey !== user.derived_key) {
        throw new Error('Geçersiz şifre');
      }

      console.log('Yerel giriş başarılı:', user);

      const currentSessionDoc = {
        _id: 'currentSession', // Artık sadece local_sessions veritabanında kullanılacak
        userId: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        hireDate: user.hireDate,
        type: 'user',
        name: user.username,
        roles: []
      };

      try {
        await this.sessionDB.put(currentSessionDoc);
      } catch (err: any) {
        if (err.status === 409) {
          // Çakışma durumunda tekrar dene
          await this.updateDocument(this.sessionDB, 'currentSession', currentSessionDoc);
        } else {
          console.error('Oturum güncelleme hatası:', err);
          throw err;
        }
      }

      return user;
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  }

  private async updateDocument(db: any, docId: string, newDoc: any): Promise<void> {
    try {
      const existingDoc = await db.get(docId);
      newDoc._rev = existingDoc._rev; // Mevcut revizyonu ekle
    } catch (err: any) {
      if (err.status !== 404) {
        throw err;
      }
    }

    try {
      await db.put(newDoc);
    } catch (err: any) {
      if (err.status === 409) {
        // Çakışma durumunda tekrar dene
        await this.updateDocument(db, docId, newDoc);
      } else {
        throw err;
      }
    }
  }

  async logout(): Promise<void> {
    try {
      const session = await this.sessionDB.get('currentSession');
      await this.sessionDB.remove(session);
      console.log('Çıkış yapıldı');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      throw error;
    }
  }

  async getSession(): Promise<any> {
    try {
      const session = await this.sessionDB.get('currentSession');
      console.log('Yerel oturum bilgisi:', session);
      return session;
    } catch (error) {
      console.error('Oturum bilgisi hatası:', error);
      return null;
    }
  }
}
