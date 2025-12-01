import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService, LogEntry } from '../../services/utility.service';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>System Logs</h2>
        <button (click)="clearLogs()" class="btn btn-danger">Clear All Logs</button>
      </div>
      
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Level</th>
              <th>Message</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of logs" [class]="'log-' + log.level.toLowerCase()">
              <td>{{log.timestamp | date:'medium'}}</td>
              <td><span class="level-badge level-{{log.level.toLowerCase()}}">{{log.level}}</span></td>
              <td>{{log.message}}</td>
              <td>{{log.userId || 'System'}}</td>
            </tr>
            <tr *ngIf="logs.length === 0">
              <td colspan="4" class="no-data">No logs found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .table-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-height: 600px; overflow-y: auto; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-danger { background: #dc3545; color: white; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .table th { background: #f8f9fa; font-weight: bold; position: sticky; top: 0; }
    .no-data { text-align: center; color: #666; font-style: italic; }
    .level-badge { padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; }
    .level-info { background: #d1ecf1; color: #0c5460; }
    .level-warning { background: #fff3cd; color: #856404; }
    .level-error { background: #f8d7da; color: #721c24; }
    .level-debug { background: #e2e3e5; color: #383d41; }
    .log-error { background-color: #fff5f5; }
    .log-warning { background-color: #fffbf0; }
  `
})
export class LogsComponent implements OnInit {
  logs: LogEntry[] = [];
  
  constructor(private utilityService: UtilityService) { debugger; console.log('logs.component loaded');}
  
  ngOnInit() {
    this.loadLogs();
  }
  
  loadLogs() {
    this.utilityService.getLogs().subscribe({
      next: (data) => this.logs = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      error: (error) => console.error('Error loading logs:', error)
    });
  }
  
  clearLogs() {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      this.utilityService.clearLogs().subscribe({
        next: () => {
          this.loadLogs();
          alert('All logs cleared successfully');
        },
        error: (error) => {
          console.error('Error clearing logs:', error);
          alert('Error clearing logs');
        }
      });
    }
  }
}
