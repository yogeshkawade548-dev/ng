import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilityService, SystemSetting } from '../../services/utility.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>System Settings</h2>
      
      <div class="settings-grid">
        <div *ngFor="let setting of settings" class="setting-card">
          <div class="setting-header">
            <h4>{{setting.key}}</h4>
            <p>{{setting.description}}</p>
          </div>
          <div class="setting-input">
            <input [(ngModel)]="setting.value" class="form-control" [placeholder]="setting.description">
            <button (click)="updateSetting(setting)" class="btn btn-primary btn-sm">Update</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
    .setting-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .setting-header h4 { margin: 0 0 5px 0; color: #333; }
    .setting-header p { margin: 0 0 15px 0; color: #666; font-size: 14px; }
    .setting-input { display: flex; gap: 10px; align-items: center; }
    .form-control { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
  `
})
export class SettingsComponent implements OnInit {
  settings: SystemSetting[] = [];
  
  constructor(private utilityService: UtilityService) { debugger; console.log('settings.component loaded');}
  
  ngOnInit() {
    this.loadSettings();
  }
  
  loadSettings() {
    this.utilityService.getSettings().subscribe({
      next: (data) => this.settings = data,
      error: (error) => console.error('Error loading settings:', error)
    });
  }
  
  updateSetting(setting: SystemSetting) {
    this.utilityService.updateSetting(setting).subscribe({
      next: () => {
        alert('Setting updated successfully');
      },
      error: (error) => {
        console.error('Error updating setting:', error);
        alert('Error updating setting');
      }
    });
  }
}
