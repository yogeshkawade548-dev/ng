import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, UserActivityReport } from '../../services/report.service';

@Component({
  selector: 'app-user-activity-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>User Activity Report</h2>
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
          <h4>Active Users</h4>
          <p class="count">{{activeUsers}}</p>
        </div>
        <div class="summary-card">
          <h4>Total Logins</h4>
          <p class="count">{{totalLogins}}</p>
        </div>
        <div class="summary-card">
          <h4>Total Actions</h4>
          <p class="count">{{totalActions}}</p>
        </div>
      </div>
      
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Login Count</th>
              <th>Last Login</th>
              <th>Actions Performed</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let report of userActivityReports">
              <td>{{report.userId}}</td>
              <td>{{report.userName}}</td>
              <td>{{report.loginCount}}</td>
              <td>{{report.lastLogin | date:'medium'}}</td>
              <td>{{report.actionsPerformed}}</td>
            </tr>
            <tr *ngIf="userActivityReports.length === 0">
              <td colspan="5" class="no-data">No user activity data found</td>
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
export class UserActivityReportComponent implements OnInit {
  userActivityReports: UserActivityReport[] = [];
  startDate = '';
  endDate = '';
  activeUsers = 0;
  totalLogins = 0;
  totalActions = 0;
  
  constructor(private reportService: ReportService) { debugger; console.log('user-activity-report.component loaded');
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.startDate = lastWeek.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }
  
  ngOnInit() {
    this.loadReport();
  }
  
  loadReport() {
    this.reportService.getUserActivityReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.userActivityReports = data;
        this.calculateSummary();
      },
      error: (error) => console.error('Error loading user activity report:', error)
    });
  }
  
  calculateSummary() {
    this.activeUsers = this.userActivityReports.length;
    this.totalLogins = this.userActivityReports.reduce((sum, report) => sum + report.loginCount, 0);
    this.totalActions = this.userActivityReports.reduce((sum, report) => sum + report.actionsPerformed, 0);
  }
  
  exportReport() {
    this.reportService.exportReport('user-activity', 'pdf').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-activity-report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Error exporting report:', error)
    });
  }
}
