import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private placeId = new BehaviorSubject<string>("place_1");
  currentPlaceId = this.placeId.asObservable();

  constructor() { }

  changePlaceId(newPlaceId: string) {
    this.placeId.next(newPlaceId);
  }
}
