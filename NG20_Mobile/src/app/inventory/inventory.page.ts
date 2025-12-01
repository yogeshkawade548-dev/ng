import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  standalone: false,
})
export class InventoryPage implements OnInit {
  items: any[] = [];
  filteredItems: any[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.apiService.getItems().subscribe({
      next: (data) => {
        this.items = data || [];
        this.filteredItems = [...this.items];
        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.filteredItems = [];
        this.loading = false;
      }
    });
  }

  filterItems(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredItems = this.items.filter(item => 
      item.name?.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm)
    );
  }

  doRefresh(event: any) {
    this.loadItems();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
