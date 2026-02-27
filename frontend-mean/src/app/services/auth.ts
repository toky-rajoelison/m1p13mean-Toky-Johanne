import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private BASE_URL = 'https://m1p13mean-toky-johanne.onrender.com/api/auth'; // your backend API
  private BASE_URL = 'http://localhost:5000/api'; // your backend API

  constructor(private http: HttpClient) { }

  // Register new user
  register(user: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/register`, user);
  }

  // Login user
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/login`, credentials);
  }

  getMyBoutique(userId: string) {
    return this.http.get(`${this.BASE_URL}/boutique/me/${userId}`);
  }
}