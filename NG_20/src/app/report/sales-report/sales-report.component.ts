import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, SalesReport } from '../../services/report.service';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Sales Report</h2>
        <button (click)="exportReport()" class="btn btn-success">Export PDF</button>
      </div>
      
      <div class="filter-card">
        <div class="filter-row">
          <div class="filter-group">
            <label>Start Date</label>
            <input [(ngModel)]="startDate" type="date" class="form-control">
          </div>
          <div class="filter-group">
            <label>End Date</label>
            <input [(ngModel)]="endDate" type="date" class="form-control">
          </div>
          <div class="filter-group">
            <button (click)="loadReport()" class="btn btn-primary">Generate Report</button>
          </div>
        </div>
      </div>
      
      <div class="summary-cards">
        <div class="summary-card">
          <h4>Total Sales</h4>
          <p class="amount">{{totalSales | currency}}</p>
        </div>
        <div class="summary-card">
          <h4>Total Orders</h4>
          <p class="count">{{totalOrders}}</p>
        </div>
        <div class="summary-card">
          <h4>Average Order</h4>
          <p class="amount">{{averageOrder | currency}}</p>
        </div>
      </div>
      
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Sales</th>
              <th>Orders</th>
              <th>Top Product</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let report of salesReports">
              <td>{{report.date | date}}</td>
              <td>{{report.totalSales | currency}}</td>
              <td>{{report.totalOrders}}</td>
              <td>{{report.topProduct}}</td>
              <td>{{report.revenue | currency}}</td>
            </tr>
            <tr *ngIf="salesReports.length === 0">
              <td colspan="5" class="no-data">No sales data found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .filter-card, .table-card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .filter-row { display: flex; gap: 15px; align-items: end; }
    .filter-group { flex: 1; }
    .filter-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
    .summary-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
    .summary-card h4 { margin: 0 0 10px 0; color: #666; }
    .amount { font-size: 24px; font-weight: bold; color: #28a745; margin: 0; }
    .count { font-size: 24px; font-weight: bold; color: #007bff; margin: 0; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-success { background: #28a745; color: white; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .table th { background: #f8f9fa; font-weight: bold; }
    .no-data { text-align: center; color: #666; font-style: italic; }
  `
})
export class SalesReportComponent implements OnInit {
  salesReports: SalesReport[] = [];
  startDate = '';
  endDate = '';
  totalSales = 0;
  totalOrders = 0;
  averageOrder = 0;
  
  constructor(private reportService: ReportService) { debugger; console.log('sales-report.component loaded');
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.startDate = lastMonth.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }
  
  ngOnInit() {
    this.loadReport();
  }
  
  loadReport() {
    this.reportService.getSalesReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.salesReports = data;
        this.calculateSummary();
      },
      error: (error) => console.error('Error loading sales report:', error)
    });
  }
  
  calculateSummary() {
    this.totalSales = this.salesReports.reduce((sum, report) => sum + report.totalSales, 0);
    this.totalOrders = this.salesReports.reduce((sum, report) => sum + report.totalOrders, 0);
    this.averageOrder = this.totalOrders > 0 ? this.totalSales / this.totalOrders : 0;
  }
  
  exportReport() {
    this.reportService.exportReport('sales', 'pdf').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sales-report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Error exporting report:', error)
    });
  }
}
