import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Order} from "./Model/Order";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private placeId = new BehaviorSubject<string>("place_1");
  currentPlaceId = this.placeId.asObservable();


  private orderData = new BehaviorSubject<Order | null>(null);
  currentOrderData = this.orderData.asObservable();
  constructor() { }

  changePlaceId(newPlaceId: string) {
    this.placeId.next(newPlaceId);
  }

  setOrderData(order: Order | null) {
    this.orderData.next(order);
  }


}
