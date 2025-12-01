import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  totalItems = 0;
  totalCompanies = 0;
  totalUsers = 0;
  totalCategories = 0;
  loading = true;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load all counts
    this.apiService.getItems().subscribe({
      next: (items) => this.totalItems = items?.length || 0,
      error: () => this.totalItems = 0
    });
    
    this.apiService.getCompanies().subscribe({
      next: (companies) => this.totalCompanies = companies?.length || 0,
      error: () => this.totalCompanies = 0
    });
    
    this.apiService.getUsers().subscribe({
      next: (users) => this.totalUsers = users?.length || 0,
      error: () => this.totalUsers = 0
    });
    
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.totalCategories = categories?.length || 0;
        this.loading = false;
      },
      error: () => {
        this.totalCategories = 0;
        this.loading = false;
      }
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  doRefresh(event?: any) {
    this.loadDashboardData();
    if (event) {
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }
  }

  navigateToItems() {
    this.router.navigate(['/tabs/inventory']);
  }

  navigateToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  navigateToReports() {
    this.router.navigate(['/reports']);
  }
}
