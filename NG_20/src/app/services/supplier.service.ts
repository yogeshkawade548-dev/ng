import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Supplier {
  id?: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'https://localhost:44335/api/Suppliers';

  constructor(private http: HttpClient) { debugger; console.log('supplier.service loaded');}

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/GetAllSuppliers`);
  }

  create(supplier: Supplier): Observable<any> {
    return this.http.post(this.apiUrl, supplier);
  }

  update(id: number, supplier: Supplier): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, supplier);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
