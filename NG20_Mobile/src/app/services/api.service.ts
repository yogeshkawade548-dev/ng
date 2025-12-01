import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:44335/api';

  constructor(private http: HttpClient) {}

  // Dashboard APIs
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/utility/GetDashboardStats`);
  }

  // Items APIs
  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/items/GetAllItems`);
  }

  // Companies APIs
  getCompanies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies/GetAllCompanies`);
  }

  // Users APIs
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/GetAllUsers`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/GetUserById?id=${id}`);
  }

  // Categories APIs
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/GetAllCategories`);
  }
}