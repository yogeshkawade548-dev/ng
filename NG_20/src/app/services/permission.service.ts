import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ComponentPermission {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canDownload: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = 'https://localhost:44335/api/Menu';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getComponentPermissions(componentName: string): Observable<ComponentPermission> {
    const user = this.authService.currentUser();
    const roleId = this.getRoleId(user?.role || 'User');
    return this.http.get<ComponentPermission>(`${this.apiUrl}/GetComponentPermissions/${roleId}/${componentName}`);
  }

  private getRoleId(roleName: string): number {
    const roleMap: { [key: string]: number } = {
      'Admin': 1,
      'Manager': 2,
      'User': 3
    };
    return roleMap[roleName] || 3;
  }
}