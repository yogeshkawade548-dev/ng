import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, FinancialReport } from '../../services/report.service';

@Component({
  selector: 'app-financial-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Financial Report</h2>
        <button (click)="exportReport()" class="btn btn-success">Export PDF</button>
      </div>
      
      <div class="filter-card">
        <div class="filter-row">
          <div class="filter-group">
            <label>Year</label>
            <select [(ngModel)]="selectedYear" class="form-control">
              <option *ngFor="let year of years" [value]="year">{{year}}</option>
            </select>
          </div>
          <div class="filter-group">
            <button (click)="loadReport()" class="btn btn-primary">Generate Report</button>
          </div>
        </div>
      </div>
      
      <div class="summary-cards">
        <div class="summary-card">
          <h4>Total Income</h4>
          <p class="income">{{totalIncome | currency}}</p>
        </div>
        <div class="summary-card">
          <h4>Total Expenses</h4>
          <p class="expense">{{totalExpenses | currency}}</p>
        </div>
        <div class="summary-card">
          <h4>Net Profit</h4>
          <p class="profit" [class.negative]="netProfit < 0">{{netProfit | currency}}</p>
        </div>
        <div class="summary-card">
          <h4>Profit Margin</h4>
          <p class="margin" [class.negative]="avgProfitMargin < 0">{{avgProfitMargin | number:'1.1-1'}}%</p>
        </div>
      </div>
      
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Profit</th>
              <th>Profit Margin</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let report of financialReports">
              <td>{{report.month}}</td>
              <td class="income">{{report.income | currency}}</td>
              <td class="expense">{{report.expenses | currency}}</td>
              <td class="profit" [class.negative]="report.profit < 0">{{report.profit | currency}}</td>
              <td class="margin" [class.negative]="report.profitMargin < 0">{{report.profitMargin | number:'1.1-1'}}%</td>
            </tr>
            <tr *ngIf="financialReports.length === 0">
              <td colspan="5" class="no-data">No financial data found</td>
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
    .income { font-size: 24px; font-weight: bold; color: #28a745; margin: 0; }
    .expense { font-size: 24px; font-weight: bold; color: #dc3545; margin: 0; }
    .profit { font-size: 24px; font-weight: bold; color: #28a745; margin: 0; }
    .profit.negative { color: #dc3545; }
    .margin { font-size: 24px; font-weight: bold; color: #007bff; margin: 0; }
    .margin.negative { color: #dc3545; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-success { background: #28a745; color: white; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .table th { background: #f8f9fa; font-weight: bold; }
    .no-data { text-align: center; color: #666; font-style: italic; }
  `
})
export class FinancialReportComponent implements OnInit {
  financialReports: FinancialReport[] = [];
  selectedYear = new Date().getFullYear();
  years: number[] = [];
  totalIncome = 0;
  totalExpenses = 0;
  netProfit = 0;
  avgProfitMargin = 0;
  
  constructor(private reportService: ReportService) { debugger; console.log('financial-report.component loaded');
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear; i++) {
      this.years.push(i);
    }
  }
  
  ngOnInit() {
    this.loadReport();
  }
  
  loadReport() {
    this.reportService.getFinancialReport(this.selectedYear).subscribe({
      next: (data) => {
        this.financialReports = data;
        this.calculateSummary();
      },
      error: (error) => console.error('Error loading financial report:', error)
    });
  }
  
  calculateSummary() {
    this.totalIncome = this.financialReports.reduce((sum, report) => sum + report.income, 0);
    this.totalExpenses = this.financialReports.reduce((sum, report) => sum + report.expenses, 0);
    this.netProfit = this.totalIncome - this.totalExpenses;
    this.avgProfitMargin = this.financialReports.length > 0 
      ? this.financialReports.reduce((sum, report) => sum + report.profitMargin, 0) / this.financialReports.length 
      : 0;
  }
  
  exportReport() {
    this.reportService.exportReport('financial', 'pdf').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Error exporting report:', error)
    });
  }
}
