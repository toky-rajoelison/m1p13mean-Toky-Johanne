import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = 'https://m1p13mean-toky-johanne.onrender.com/api/auth'; // your backend API
  // private BASE_URL = 'http://localhost:5000/api/auth'; // your backend API

  constructor(private http: HttpClient) { }

  // Register new user
  register(user: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, user);
  }

  // Login user
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, credentials);
  }
}