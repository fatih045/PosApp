

import { Component } from '@angular/core';

import {FormsModule} from "@angular/forms";
import {UserService} from "../services/user/user.service";

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
  name: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private userService: UserService) { }

  onRegister() {
    this.userService.register(this.name, this.email, this.username, this.password, this.confirmPassword).subscribe(response => {
      console.log('Registration successful:', response);
    }, error => {
      console.error('Registration failed:', error);
    });
  }
}

