import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MenuService, MenuItem } from '../services/menu.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isSidenavOpen = signal(false);
  showMaster = signal(false);
  showInventory = signal(false);
  showUtility = signal(false);
  showReport = signal(false);

  showProfile = signal(false);
  searchTerm = '';
  
  private router = inject(Router);
  
  isDashboard = signal(false);
  
  userMenus: MenuItem[] = [];
  
  constructor(public authService: AuthService, private menuService: MenuService) {
    window.addEventListener('showMasterMenu', () => this.showMasterMenu());
    window.addEventListener('showInventoryMenu', () => this.showInventoryMenu());
    window.addEventListener('showUtilityMenu', () => this.showUtilityMenu());
    window.addEventListener('showReportMenu', () => this.showReportMenu());
    // Check if current route is master or user-management
    if (this.router.url === '/master' || this.router.url === '/user-management' || this.router.url === '/company' || this.router.url === '/category') {
      this.showMaster.set(true);
      this.isSidenavOpen.set(true);
    }
    // Check if current route is inventory
    if (this.router.url === '/inventory' || this.router.url === '/item' || this.router.url === '/stock' || this.router.url === '/suppliers' || this.router.url === '/purchase-order') {
      this.showInventory.set(true);
      this.isSidenavOpen.set(true);
    }
    // Check if current route is utility
    if (this.router.url === '/utility' || this.router.url === '/backup' || this.router.url === '/restore' || this.router.url === '/settings' || this.router.url === '/logs' || this.router.url === '/maintenance') {
      this.showUtility.set(true);
      this.isSidenavOpen.set(true);
    }
    // Check if current route is report
    if (this.router.url === '/report' || this.router.url === '/sales-report' || this.router.url === '/inventory-report' || this.router.url === '/user-activity-report' || this.router.url === '/financial-report') {
      this.showReport.set(true);
      this.isSidenavOpen.set(true);
    }
    // Check if current route is role-permissions
    if (this.router.url === '/role-permissions') {
      this.showMaster.set(true);
      this.isSidenavOpen.set(true);
    }

    // Check if current route is dashboard
    this.isDashboard.set(this.router.url === '/dashboard');
  }

  ngOnInit() {
    this.loadUserMenus();
  }

  loadUserMenus() {
    const user = this.authService.currentUser();
    if (user?.role) {
      const roleId = this.getRoleId(user.role);
      this.menuService.getUserMenus(roleId).subscribe({
        next: (menus) => {
          this.userMenus = menus;
        },
        error: (error) => console.error('Failed to load menus:', error)
      });
    }
  }

  getRoleId(roleName: string): number {
    const roleMap: { [key: string]: number } = {
      'Admin': 1,
      'Manager': 2,
      'User': 3
    };
    return roleMap[roleName] || 3;
  }

  hasMenuAccess(menuName: string): boolean {
    return this.userMenus.some(menu => menu.name === menuName && menu.permissions.canView);
  }
  
  toggleSidenav() {
    this.isSidenavOpen.update(value => !value);
  }
  
  showMasterMenu() {
    this.showMaster.set(true);
    this.showInventory.set(false);
    this.showUtility.set(false);
    this.showReport.set(false);
    this.isSidenavOpen.set(true);
  }
  
  showInventoryMenu() {
    this.showInventory.set(true);
    this.showMaster.set(false);
    this.showUtility.set(false);
    this.showReport.set(false);
    this.isSidenavOpen.set(true);
    this.router.navigate(['/inventory']);
  }
  
  showUtilityMenu() {
    this.showUtility.set(true);
    this.showMaster.set(false);
    this.showInventory.set(false);
    this.showReport.set(false);
    this.isSidenavOpen.set(true);
    this.router.navigate(['/utility']);
  }
  
  showReportMenu() {
    this.showReport.set(true);
    this.showMaster.set(false);
    this.showInventory.set(false);
    this.showUtility.set(false);
    this.isSidenavOpen.set(true);
    this.router.navigate(['/report']);
  }
  
  showUserManagementPage() {
    this.router.navigate(['/user-management']);
  }
  
  showCompanyPage() {
    this.router.navigate(['/company']);
  }

  
  showCategoryPage() {
    this.router.navigate(['/category']);
  }
  
  showItemsPage() {
    this.router.navigate(['/item']);
  }
  
  showStockPage() {
    this.router.navigate(['/stock']);
  }
  

  
  showSuppliersPage() {
    this.router.navigate(['/suppliers']);
  }
  
  showPurchaseOrderPage() {
    this.router.navigate(['/purchase-order']);
  }
  
  showBackupPage() {
    this.router.navigate(['/backup']);
  }
  
  showRestorePage() {
    this.router.navigate(['/restore']);
  }
  
  showSettingsPage() {
    this.router.navigate(['/settings']);
  }
  
  showLogsPage() {
    this.router.navigate(['/logs']);
  }
  
  showMaintenancePage() {
    this.router.navigate(['/maintenance']);
  }
  
  showSalesReportPage() {
    this.router.navigate(['/sales-report']);
  }
  
  showInventoryReportPage() {
    this.router.navigate(['/inventory-report']);
  }
  
  showUserActivityReportPage() {
    this.router.navigate(['/user-activity-report']);
  }
  
  showFinancialReportPage() {
    this.router.navigate(['/financial-report']);
  }

  showRolePermissionsPage() {
    this.router.navigate(['/role-permissions']);
  }

  showEncryptionPage() {
    this.router.navigate(['/encryption']);
  }
  

  
  showProfileModal() {
    this.showProfile.set(true);
  }

  closeProfile() {
    this.showProfile.set(false);
  }

  logout() {
    this.authService.logout();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }



  get filteredNavItems() {
    const allItems = [
      { name: 'User Management', action: () => this.showUserManagementPage() },
      { name: 'Dashboard', action: () => this.router.navigate(['/dashboard']) }
    ];
    
    if (!this.searchTerm) return [];
    return allItems.filter(item => 
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}