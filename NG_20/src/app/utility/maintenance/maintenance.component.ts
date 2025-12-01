import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>System Maintenance</h2>
      
      <div class="maintenance-grid">
        <div class="maintenance-card">
          <h4>Database Optimization</h4>
          <p>Optimize database performance by rebuilding indexes and updating statistics.</p>
          <button (click)="runMaintenance('database')" class="btn btn-primary" [disabled]="isRunning">{{isRunning ? 'Running...' : 'Run Database Optimization'}}</button>
        </div>
        
        <div class="maintenance-card">
          <h4>Cache Cleanup</h4>
          <p>Clear application cache and temporary files to free up space.</p>
          <button (click)="runMaintenance('cache')" class="btn btn-primary" [disabled]="isRunning">{{isRunning ? 'Running...' : 'Clear Cache'}}</button>
        </div>
        
        <div class="maintenance-card">
          <h4>Log Rotation</h4>
          <p>Archive old log files and create new log files for better performance.</p>
          <button (click)="runMaintenance('logs')" class="btn btn-primary" [disabled]="isRunning">{{isRunning ? 'Running...' : 'Rotate Logs'}}</button>
        </div>
        
        <div class="maintenance-card">
          <h4>System Health Check</h4>
          <p>Perform comprehensive system health check and generate report.</p>
          <button (click)="runMaintenance('health')" class="btn btn-primary" [disabled]="isRunning">{{isRunning ? 'Running...' : 'Health Check'}}</button>
        </div>
      </div>
      
      <div *ngIf="maintenanceStatus" class="status-card">
        <h4>Maintenance Status</h4>
        <div class="status-info">
          <p><strong>Last Run:</strong> {{maintenanceStatus.lastRun | date:'medium'}}</p>
          <p><strong>Status:</strong> <span [class]="'status-' + maintenanceStatus.status.toLowerCase()">{{maintenanceStatus.status}}</span></p>
          <p><strong>Duration:</strong> {{maintenanceStatus.duration}} seconds</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .maintenance-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .maintenance-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .maintenance-card h4 { margin: 0 0 10px 0; color: #333; }
    .maintenance-card p { margin: 0 0 15px 0; color: #666; }
    .status-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .status-card h4 { margin: 0 0 15px 0; color: #333; }
    .status-info p { margin: 5px 0; }
    .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
    .btn-primary { background: #007bff; color: white; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .status-success { color: #28a745; font-weight: bold; }
    .status-running { color: #ffc107; font-weight: bold; }
    .status-failed { color: #dc3545; font-weight: bold; }
  `
})
export class MaintenanceComponent implements OnInit {
  isRunning = false;
  maintenanceStatus: any = null;
  
  constructor(private utilityService: UtilityService) { debugger; console.log('maintenance.component loaded');}
  
  ngOnInit() {
    this.loadMaintenanceStatus();
  }
  
  loadMaintenanceStatus() {
    this.utilityService.getMaintenanceStatus().subscribe({
      next: (data) => this.maintenanceStatus = data,
      error: (error) => console.error('Error loading maintenance status:', error)
    });
  }
  
  runMaintenance(type: string) {
    if (confirm(`Are you sure you want to run ${type} maintenance? This may take several minutes.`)) {
      this.isRunning = true;
      this.utilityService.runMaintenance().subscribe({
        next: () => {
          this.isRunning = false;
          this.loadMaintenanceStatus();
          alert(`${type} maintenance completed successfully`);
        },
        error: (error) => {
          console.error('Error running maintenance:', error);
          this.isRunning = false;
          alert(`Error running ${type} maintenance`);
        }
      });
    }
  }
}
