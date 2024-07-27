import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ChooseplaceComponent} from "./chooseplace/chooseplace.component";
import { MainComponent } from './main/main.component';
import {OrderComponent} from "./order/order.component";

export const routes: Routes = [


  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'choose-place', component: ChooseplaceComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'restaurant/main', component: MainComponent},
  { path: 'pub/main', component: MainComponent},
  { path: 'pool/main', component: MainComponent},
  {path:'orders',component:OrderComponent}

];




// // { path: 'products', component: ProductComponent },
// { path: '', redirectTo: '/login', pathMatch: 'full' }, // Varsayılan rota
// { path: '**', redirectTo: '/login', pathMatch: 'full' } // 404 benzeri durumlar için
