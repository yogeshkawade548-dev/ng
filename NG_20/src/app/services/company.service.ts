import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Company {
  id?: number;
  name: string;
  address: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'https://localhost:44335/api/Companies';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/GetAllCompany`);
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/GetCompanyById?id=${id}`);
  }

  create(company: Company): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateCompany`, company);
  }

  update(id: number, company: Company): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateCompanyById/${id}`, company);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteCompany?id=${id}`);
  }
}
