import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService, InventoryReport } from '../../services/report.service';

@Component({
  selector: 'app-inventory-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Inventory Report</h2>
        <button (click)="exportReport()" class="btn btn-success">Export PDF</button>
      </div>
      
      <div class="summary-cards">
        <div class="summary-card">
          <h4>Total Items</h4>
          <p class="count">{{totalItems}}</p>
        </div>
        <div class="summary-card">
          <h4>Low Stock Items</h4>
          <p class="warning">{{lowStockItems}}</p>
        </div>
        <div class="summary-card">
          <h4>Out of Stock</h4>
          <p class="danger">{{outOfStockItems}}</p>
        </div>
      </div>
      
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Current Stock</th>
              <th>Min Stock</th>
              <th>Max Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let report of inventoryReports" [class]="'status-' + report.status.toLowerCase()">
              <td>{{report.itemName}}</td>
              <td>{{report.currentStock}}</td>
              <td>{{report.minStock}}</td>
              <td>{{report.maxStock}}</td>
              <td><span class="status-badge status-{{report.status.toLowerCase()}}">{{report.status}}</span></td>
            </tr>
            <tr *ngIf="inventoryReports.length === 0">
              <td colspan="5" class="no-data">No inventory data found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .table-card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
    .summary-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
    .summary-card h4 { margin: 0 0 10px 0; color: #666; }
    .count { font-size: 24px; font-weight: bold; color: #007bff; margin: 0; }
    .warning { font-size: 24px; font-weight: bold; color: #ffc107; margin: 0; }
    .danger { font-size: 24px; font-weight: bold; color: #dc3545; margin: 0; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-success { background: #28a745; color: white; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .table th { background: #f8f9fa; font-weight: bold; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .status-normal { background: #d4edda; color: #155724; }
    .status-low { background: #fff3cd; color: #856404; }
    .status-out { background: #f8d7da; color: #721c24; }
    .status-low { background-color: #fff8e1; }
    .status-out { background-color: #ffebee; }
    .no-data { text-align: center; color: #666; font-style: italic; }
  `
})
export class InventoryReportComponent implements OnInit {
  inventoryReports: InventoryReport[] = [];
  totalItems = 0;
  lowStockItems = 0;
  outOfStockItems = 0;
  
  constructor(private reportService: ReportService) { debugger; console.log('inventory-report.component loaded');}
  
  ngOnInit() {
    this.loadReport();
  }
  
  loadReport() {
    this.reportService.getInventoryReport().subscribe({
      next: (data) => {
        this.inventoryReports = data;
        this.calculateSummary();
      },
      error: (error) => console.error('Error loading inventory report:', error)
    });
  }
  
  calculateSummary() {
    this.totalItems = this.inventoryReports.length;
    this.lowStockItems = this.inventoryReports.filter(item => item.status === 'Low').length;
    this.outOfStockItems = this.inventoryReports.filter(item => item.status === 'Out').length;
  }
  
  exportReport() {
    this.reportService.exportReport('inventory', 'pdf').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory-report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Error exporting report:', error)
    });
  }
}
