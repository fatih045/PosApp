import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class CouchdbService {


  private  db:any;



  constructor() {

    this.db=new PouchDB ("http://localhost:5984/products")
  }


  addItem(item:any){

    return this.db.post(item)
  }

  getItems() {
    return this.db.allDocs({ include_docs: true });
  }

  updateItem(item: any) {
    return this.db.put(item);
  }

  deleteItem(item: any) {
    return this.db.remove(item);
  }
  getAttachment(docId: string, attachmentId: string) {
    return this.db.getAttachment(docId, attachmentId);
  }





}
