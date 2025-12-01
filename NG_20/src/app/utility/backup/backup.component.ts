import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService, BackupInfo } from '../../services/utility.service';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Database Backup</h2>
        <button (click)="createBackup()" class="btn btn-primary" [disabled]="isCreating">{{isCreating ? 'Creating...' : 'Create Backup'}}</button>
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
                <button (click)="deleteBackup(backup.id!)" class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
            <tr *ngIf="backups.length === 0">
              <td colspan="4" class="no-data">No backups found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .container { padding: 20px; max-width: 1000px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .table-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .table th { background: #f8f9fa; font-weight: bold; }
    .no-data { text-align: center; color: #666; font-style: italic; }
  `
})
export class BackupComponent implements OnInit {
  backups: BackupInfo[] = [];
  isCreating = false;
  
  constructor(private utilityService: UtilityService) { debugger; console.log('backup.component loaded');}
  
  ngOnInit() {
    this.loadBackups();
  }
  
  loadBackups() {
    this.utilityService.getBackups().subscribe({
      next: (data) => this.backups = data,
      error: (error) => console.error('Error loading backups:', error)
    });
  }
  
  createBackup() {
    this.isCreating = true;
    this.utilityService.createBackup().subscribe({
      next: () => {
        this.loadBackups();
        this.isCreating = false;
        alert('Backup created successfully');
      },
      error: (error) => {
        console.error('Error creating backup:', error);
        this.isCreating = false;
        alert('Error creating backup');
      }
    });
  }
  
  deleteBackup(id: number) {
    if (confirm('Are you sure you want to delete this backup?')) {
      this.utilityService.deleteBackup(id).subscribe({
        next: () => {
          this.loadBackups();
          alert('Backup deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting backup:', error);
          alert('Error deleting backup');
        }
      });
    }
  }
}
