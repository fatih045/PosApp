import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ItemListComponent} from "./item-list/item-list.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ChooseplaceComponent} from "./chooseplace/chooseplace.component";
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ItemListComponent, LoginComponent, RegisterComponent, ChooseplaceComponent,MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PosApp';
}
