import { Component } from '@angular/core';
import {CouchdbService} from "../couchdb.service";
import {AuthService} from "../auth.service";
import {FormsModule} from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  username: string = '';
  password: string = '';

  constructor(private pouchdbService:AuthService, private router: Router ) {}

  login() {
    console.log('Giriş bilgileri:', this.username, this.password); // Kullanıcı adı ve şifreyi konsola yazdırma


    this.pouchdbService.login(this.username, this.password)
      .then( (response: any) =>{
        console.log('Login successful', response);
        alert("Kullanıcı girişi başarılı")
        this.router.navigate(['/choose-place']);

      })
      .catch((error: any) => {
        console.error('Login failed', error);

      });

  }
}
