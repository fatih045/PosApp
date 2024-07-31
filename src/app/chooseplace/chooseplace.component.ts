import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { PlaceService } from '../services/place/place.service';
import { Place } from '../Model/Place';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-chooseplace',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './chooseplace.component.html',
  styleUrl: './chooseplace.component.css'
})
export class ChooseplaceComponent implements OnInit {
  places: Place[] = []; 

  constructor(private sharedService: SharedService, private placeService: PlaceService) {}

  async ngOnInit() {
    try {
      this.places = await this.placeService.getAllPlaces();
    } catch (error) {
      console.log("Mekanlar yüklenirken hata oluştu");
    }
  }

  onPlaceSelect(placeId: string) {
    this.sharedService.changePlaceId(placeId);
  }
}
