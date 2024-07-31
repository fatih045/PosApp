import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8000/api/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(name: string, email: string, username: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, username, password, confirmPassword });
  }
}
