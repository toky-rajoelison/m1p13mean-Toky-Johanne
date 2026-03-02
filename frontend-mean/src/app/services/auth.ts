import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private BASE_URL = 'https://m1p13mean-toky-johanne.onrender.com/api/auth'; // your backend API
  private BASE_URL = environment.apiUrl; // your backend API

  constructor(private http: HttpClient) { }

  // Register new user
  register(user: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/register`, user);
  }

  // Login user
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/login`, credentials);
  }

  logout() {
    return this.http.post<any>(`${this.BASE_URL}/auth/logout`, {});
  }


}