import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface Role {
  id: number;
  name: string;
}

interface Menu {
  id: number;
  name: string;
}

interface Permission {
  roleId: number;
  menuId: number;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './role-permissions.component.html',
  styleUrl: './role-permissions.component.css'
})
export class RolePermissionsComponent implements OnInit {
  roles: Role[] = [];
  menus: Menu[] = [];
  permissions: Permission[] = [];
  selectedRole: number = 1;
  displayedColumns: string[] = ['component', 'view', 'create', 'edit', 'delete'];
  
  private apiUrl = 'https://localhost:44335/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRoles();
    this.loadMenus();
    this.loadPermissions();
  }

  loadRoles() {
    this.http.get<Role[]>(`${this.apiUrl}/Roles/GetAllRoles`).subscribe({
      next: (roles) => this.roles = roles,
      error: (error) => console.error('Failed to load roles:', error)
    });
  }

  loadMenus() {
    this.http.get<Menu[]>(`${this.apiUrl}/Menu/GetAllMenus`).subscribe({
      next: (menus) => this.menus = menus,
      error: (error) => console.error('Failed to load menus:', error)
    });
  }

  onRoleChange() {
    if (this.selectedRole) {
      this.loadPermissions();
    }
  }

  loadPermissions() {
    this.http.get<Permission[]>(`${this.apiUrl}/Menu/GetRolePermissions/${this.selectedRole}`).subscribe({
      next: (permissions) => this.permissions = permissions,
      error: (error) => console.error('Failed to load permissions:', error)
    });
  }

  hasPermission(menuId: number, type: string): boolean {
    const permission = this.permissions.find(p => p.menuId === menuId);
    if (!permission) return false;
    
    switch (type) {
      case 'view': return permission.canView;
      case 'create': return permission.canCreate;
      case 'edit': return permission.canEdit;
      case 'delete': return permission.canDelete;
      default: return false;
    }
  }

  onPermissionChange(menuId: number, type: string, event: any) {
    const checked = event.target ? event.target.checked : event.checked;
    this.updatePermission(menuId, type, checked);
  }

  updatePermission(menuId: number, type: string, value: boolean) {
    const permission = this.permissions.find(p => p.menuId === menuId);
    if (permission) {
      switch (type) {
        case 'view': permission.canView = value; break;
        case 'create': permission.canCreate = value; break;
        case 'edit': permission.canEdit = value; break;
        case 'delete': permission.canDelete = value; break;
      }
    } else {
      const newPermission: Permission = {
        roleId: this.selectedRole,
        menuId: menuId,
        canView: type === 'view' ? value : false,
        canCreate: type === 'create' ? value : false,
        canEdit: type === 'edit' ? value : false,
        canDelete: type === 'delete' ? value : false
      };
      this.permissions.push(newPermission);
    }
  }

  savePermissions() {
    this.http.post(`${this.apiUrl}/Menu/SaveRolePermissions`, {
      roleId: this.selectedRole,
      permissions: this.permissions
    }).subscribe({
      next: () => alert('Permissions saved successfully'),
      error: (error) => {
        console.error('Failed to save permissions:', error);
        alert('Failed to save permissions');
      }
    });
  }
}