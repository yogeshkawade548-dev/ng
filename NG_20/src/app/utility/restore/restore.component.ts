import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService, BackupInfo } from '../../services/utility.service';

@Component({
  selector: 'app-restore',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Database Restore</h2>
      
      <div class="warning-card">
        <h4>⚠️ Warning</h4>
        <p>Restoring a backup will overwrite all current data. This action cannot be undone.</p>
      </div>
      
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Created Date</th>
              <th>Size (MB)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let backup of backups">
              <td>{{backup.fileName}}</td>
              <td>{{backup.createdDate | date:'medium'}}</td>
              <td>{{(backup.size / 1024 / 1024) | number:'1.2-2'}}</td>
              <td>
                <button (click)="restoreBackup(backup.id!)" class="btn btn-sm btn-warning" [disabled]="isRestoring">{{isRestoring ? 'Restoring...' : 'Restore'}}</button>
              </td>
            </tr>
            <tr *ngIf="backups.length === 0">
              <td colspan="4" class="no-data">No backups available for restore</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .container { padding: 20px; max-width: 1000px; margin: 0 auto; }
    .warning-card { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
    .warning-card h4 { color: #856404; margin: 0 0 10px 0; }
    .warning-card p { color: #856404; margin: 0; }
    .table-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-warning { background: #ffc107; color: black; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .table th { background: #f8f9fa; font-weight: bold; }
    .no-data { text-align: center; color: #666; font-style: italic; }
  `
})
export class RestoreComponent implements OnInit {
  backups: BackupInfo[] = [];
  isRestoring = false;
  
  constructor(private utilityService: UtilityService) { debugger; console.log('restore.component loaded');}
  
  ngOnInit() {
    this.loadBackups();
  }
  
  loadBackups() {
    this.utilityService.getBackups().subscribe({
      next: (data) => this.backups = data,
      error: (error) => console.error('Error loading backups:', error)
    });
  }
  
  restoreBackup(id: number) {
    if (confirm('Are you sure you want to restore this backup? This will overwrite all current data and cannot be undone.')) {
      this.isRestoring = true;
      this.utilityService.restoreBackup(id).subscribe({
        next: () => {
          this.isRestoring = false;
          alert('Database restored successfully');
        },
        error: (error) => {
          console.error('Error restoring backup:', error);
          this.isRestoring = false;
          alert('Error restoring backup');
        }
      });
    }
  }
}
