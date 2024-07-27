import {Component, OnInit} from '@angular/core';
import {CouchdbService} from "../services/couchdb.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent implements OnInit {

  items:any [] =[];

  constructor(private couchDbService: CouchdbService) {

  }

  ngOnInit(): void {
    this.loadItems()
  }


  loadItems() {


    this.couchDbService.getItems().then((result:any) =>{
      this.items=result.rows.map((row:any)=>row.doc)
    });
  }
  addItem(item: any) {
    this.couchDbService.addItem(item).then(() => {
      this.loadItems();
    });
  }

  updateItem(item: any) {
    this.couchDbService.updateItem(item).then(() => {
      this.loadItems();
    });
  }

  deleteItem(item: any) {
    this.couchDbService.deleteItem(item).then(() => {
      this.loadItems();
    });
  }

  getAttachmentUrl(item: any, attachmentName: string): string {
    return this.couchDbService.getAttachment(item._id, attachmentName).then((blob: Blob) => {
      return URL.createObjectURL(blob);
    });
  }




}
