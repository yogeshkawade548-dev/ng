import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuPermission {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  route?: string;
  icon?: string;
  parentId?: number;
  displayOrder: number;
  permissions: MenuPermission;
  children?: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'https://localhost:44335/api/Menu';

  constructor(private http: HttpClient) {}

  getUserMenus(roleId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/GetUserMenus/${roleId}`);
  }
}