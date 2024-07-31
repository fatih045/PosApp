import { Component } from '@angular/core';
import { CouchdbService } from "../services/couchdb.service";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { UserService } from "../services/user/user.service";
import { routes } from "../app.routes";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) { }

  onLogin() {
    this.userService.login(this.username, this.password).subscribe(response => {
      console.log('Login successful:', response);
      this.router.navigate(['/choose-place']);
      // Yanıtı sakla
      localStorage.setItem('token', response.token);
      localStorage.setItem('password', response.password);
      localStorage.setItem('user_id', response.user_id);
    }, error => {
      console.error('Login failed:', error);
    });
  }
}
