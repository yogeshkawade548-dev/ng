import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BackupInfo {
  id?: number;
  fileName: string;
  filePath: string;
  createdDate: Date;
  size: number;
}

export interface LogEntry {
  id?: number;
  level: string;
  message: string;
  timestamp: Date;
  userId?: number;
}

export interface SystemSetting {
  id?: number;
  key: string;
  value: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private apiUrl = 'https://localhost:44335/api/utility';

  constructor(private http: HttpClient) { debugger; console.log('utility.service loaded');}

  // Backup operations
  createBackup(): Observable<any> {
    return this.http.post(`${this.apiUrl}/backup`, {});
  }

  getBackups(): Observable<BackupInfo[]> {
    return this.http.get<BackupInfo[]>(`${this.apiUrl}/backups`);
  }

  deleteBackup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/backup/${id}`);
  }

  // Restore operations
  restoreBackup(backupId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/restore/${backupId}`, {});
  }

  // Settings operations
  getSettings(): Observable<SystemSetting[]> {
    return this.http.get<SystemSetting[]>(`${this.apiUrl}/settings`);
  }

  updateSetting(setting: SystemSetting): Observable<any> {
    return this.http.put(`${this.apiUrl}/settings/${setting.id}`, setting);
  }

  // Logs operations
  getLogs(): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(`${this.apiUrl}/logs`);
  }

  clearLogs(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/logs`);
  }

  // Maintenance operations
  runMaintenance(): Observable<any> {
    return this.http.post(`${this.apiUrl}/maintenance`, {});
  }

  getMaintenanceStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/maintenance/status`);
  }
}
