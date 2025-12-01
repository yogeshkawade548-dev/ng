import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesReport {
  date: Date;
  totalSales: number;
  totalOrders: number;
  topProduct: string;
  revenue: number;
}

export interface InventoryReport {
  itemName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: string;
}

export interface UserActivityReport {
  userId: number;
  userName: string;
  loginCount: number;
  lastLogin: Date;
  actionsPerformed: number;
}

export interface FinancialReport {
  month: string;
  income: number;
  expenses: number;
  profit: number;
  profitMargin: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'https://localhost:44335/api/reports';

  constructor(private http: HttpClient) { debugger; console.log('report.service loaded');}

  getSalesReport(startDate: string, endDate: string): Observable<SalesReport[]> {
    return this.http.get<SalesReport[]>(`${this.apiUrl}/sales?startDate=${startDate}&endDate=${endDate}`);
  }

  getInventoryReport(): Observable<InventoryReport[]> {
    return this.http.get<InventoryReport[]>(`${this.apiUrl}/inventory`);
  }

  getUserActivityReport(startDate: string, endDate: string): Observable<UserActivityReport[]> {
    return this.http.get<UserActivityReport[]>(`${this.apiUrl}/user-activity?startDate=${startDate}&endDate=${endDate}`);
  }

  getFinancialReport(year: number): Observable<FinancialReport[]> {
    return this.http.get<FinancialReport[]>(`${this.apiUrl}/financial?year=${year}`);
  }

  exportReport(reportType: string, format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/${reportType}?format=${format}`, { responseType: 'blob' });
  }
}
