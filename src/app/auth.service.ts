import { Injectable } from '@angular/core';
import PouchDBAuthentication from 'pouchdb-authentication';
import PouchDB from 'pouchdb';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private db: any;

  constructor() {
    PouchDB.plugin(PouchDBAuthentication);
    this.db = new PouchDB('http://localhost:5984/_users'); // CouchDB kullanıcı veritabanı
  }

  register(userInfo: {username: string, password: string, firstName: string, lastName: string, hireDate: string}): Promise<any> {
    return this.db.signUp(userInfo.username, userInfo.password, {
      metadata: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        hireDate: userInfo.hireDate
      }
    });
  }

  login(username: string, password: string): Promise<any> {
    return this.db.logIn(username, password);
  }

  logout(): Promise<any> {
    return this.db.logOut();
  }

  getSession(): Promise<any> {
    return this.db.getSession();
  }
}
