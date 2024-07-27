// import { Component } from '@angular/core';
// import {AuthService} from "../auth.service";
// import {FormsModule} from "@angular/forms";
//
// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [
//     FormsModule
//   ],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.css'
// })
// export class RegisterComponent {
//
//
//   username:string ='';
//   password:string ='';
//
//   constructor(private  authService:AuthService) {
//
//
//   }
//
//   register() {
//
//     this.authService.register(this.username,this.password).
//       then((response:any)=> {
//         console.log("Register successful ",response)
//     })
//       .catch((error:any)=>{
//         console.error("Register failed",error)
//       })
//
//   }
//
// }

import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  hireDate: string = '';
  constructor(private authService: AuthService) {}

  register() {
    const userInfo = {
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      hireDate: this.hireDate
    };

    this.authService.register(userInfo)
      .then((response: any) => {
        console.log("Register successful", response);
        alert("Kullanıcı kaydı başarılı")
      })
      .catch((error: any) => {
        console.error("Register failed", error);
      });
  }
}

