import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PurchaseOrder {
  id?: number;
  supplierId: number;
  orderDate: Date;
  totalAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private apiUrl = 'https://localhost:44335/api/PurchaseOrders';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/GetAllPurchaseOrders`);
  }

  create(order: PurchaseOrder): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  update(id: number, order: PurchaseOrder): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, order);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
