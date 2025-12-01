import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isSidenavOpen = signal(false);
  showMaster = signal(false);
  showInventory = signal(false);
  showUtility = signal(false);
  showReport = signal(false);
  showProfile = signal(false);
  searchTerm = '';
  filteredNavItems: any[] = [];
  
  constructor(public authService: AuthService, private router: Router) { debugger; console.log('dashboard.component loaded');
    debugger;
    console.log('Dashboard component loaded');
  }
  
  toggleSidenav() {
    this.isSidenavOpen.update(value => !value);
  }
  
  showProfileModal() {
    this.showProfile.set(true);
  }
  
  closeProfile() {
    this.showProfile.set(false);
  }
  
  showUserManagementPage() {
    this.router.navigate(['/app/user-management']);
  }
  
  showRoleManagementPage() {
    window.dispatchEvent(new CustomEvent('showRoleManagementPage'));
  }
  
  showAccessPage() {
    window.dispatchEvent(new CustomEvent('showAccessPage'));
  }
  
  logout() {
    this.authService.logout();
  }
  
  showMasterMenu() {
    this.router.navigate(['/master']);
  }
  
  showInventoryMenu() {
    window.dispatchEvent(new CustomEvent('showInventoryMenu'));
  }
  
  showUtilityMenu() {
    window.dispatchEvent(new CustomEvent('showUtilityMenu'));
  }

  showReportMenu() {
    window.dispatchEvent(new CustomEvent('showReportMenu'));
  }
  

}
