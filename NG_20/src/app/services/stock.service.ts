import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stock {
  id?: number;
  itemId: number;
  quantity: number;
  location: string;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'https://localhost:44335/api/Stock';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/GetAllStock`);
  }

  create(stock: Stock): Observable<any> {
    return this.http.post(this.apiUrl, stock);
  }

  update(id: number, stock: Stock): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, stock);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
