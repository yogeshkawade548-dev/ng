import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './master/user-management/user-management.component';
import { MasterComponent } from './master/master.component';
import { InventoryComponent } from './inventory/inventory.component';
import { CompanyComponent } from './master/company/company.component';
import { CategoryComponent } from './master/category/category.component';
import { ItemComponent } from './inventory/item/item.component';
import { StockComponent } from './inventory/stock/stock.component';
import { SuppliersComponent } from './inventory/suppliers/suppliers.component';
import { PurchaseOrderComponent } from './inventory/purchase-order/purchase-order.component';
import { BackupComponent } from './utility/backup/backup.component';
import { RestoreComponent } from './utility/restore/restore.component';
import { SettingsComponent } from './utility/settings/settings.component';
import { LogsComponent } from './utility/logs/logs.component';
import { MaintenanceComponent } from './utility/maintenance/maintenance.component';
import { SalesReportComponent } from './report/sales-report/sales-report.component';
import { InventoryReportComponent } from './report/inventory-report/inventory-report.component';
import { UserActivityReportComponent } from './report/user-activity-report/user-activity-report.component';
import { FinancialReportComponent } from './report/financial-report/financial-report.component';
import { UtilityComponent } from './utility/utility.component';
import { ReportComponent } from './report/report.component';

import { LayoutComponent } from './layout/layout.component';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: DashboardComponent }] },
  { path: 'master', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: MasterComponent }] },
  { path: 'inventory', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: InventoryComponent }] },
  { path: 'user-management', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: UserManagementComponent }] },
  { path: 'role-permissions', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', loadComponent: () => import('./master/role-permissions/role-permissions.component').then(m => m.RolePermissionsComponent) }] },
  { path: 'encryption', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', loadComponent: () => import('./master/encryption/encryption.component').then(m => m.EncryptionComponent) }] },
  { path: 'company', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: CompanyComponent }] },
  { path: 'category', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: CategoryComponent }] },
  { path: 'item', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: ItemComponent }] },
  { path: 'stock', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: StockComponent }] },
  { path: 'suppliers', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: SuppliersComponent }] },
  { path: 'purchase-order', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: PurchaseOrderComponent }] },
  { path: 'backup', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: BackupComponent }] },
  { path: 'restore', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: RestoreComponent }] },
  { path: 'settings', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: SettingsComponent }] },
  { path: 'logs', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: LogsComponent }] },
  { path: 'maintenance', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: MaintenanceComponent }] },
  { path: 'sales-report', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: SalesReportComponent }] },
  { path: 'inventory-report', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: InventoryReportComponent }] },
  { path: 'user-activity-report', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: UserActivityReportComponent }] },
  { path: 'financial-report', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: FinancialReportComponent }] },
  { path: 'utility', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: UtilityComponent }] },
  { path: 'report', component: LayoutComponent, canActivate: [authGuard], children: [{ path: '', component: ReportComponent }] },


  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
