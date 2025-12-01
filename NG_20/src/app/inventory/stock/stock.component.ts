import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, Stock } from '../../services/stock.service';
import { ItemService, Item } from '../../services/item.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Stock Management</h2>
        <button (click)="showForm = !showForm" class="btn btn-primary">{{showForm ? 'Cancel' : 'Add Stock'}}</button>
      </div>
      
      <div *ngIf="showForm" class="form-card">
        <h3>{{editingId ? 'Edit' : 'Add'}} Stock</h3>
        <form (ngSubmit)="saveStock()">
          <div class="form-row">
            <div class="form-group">
              <label>Item *</label>
              <select [(ngModel)]="stock.itemId" name="itemId" required class="form-control">
                <option value="">Select Item</option>
                <option *ngFor="let item of items" [value]="item.id">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Quantity *</label>
              <input [(ngModel)]="stock.quantity" name="quantity" type="number" required class="form-control" placeholder="Enter quantity">
            </div>
          </div>
          <div class="form-group">
            <label>Location</label>
            <input [(ngModel)]="stock.location" name="location" class="form-control" placeholder="Enter location">
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-success">{{editingId ? 'Update' : 'Save'}}</button>
            <button type="button" (click)="cancelEdit()" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
      
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let stk of stocks">
              <td>{{stk.id}}</td>
              <td>{{getItemName(stk.itemId)}}</td>
              <td>{{stk.quantity}}</td>
              <td>{{stk.location}}</td>
              <td>{{stk.lastUpdated | date}}</td>
              <td>
                <button (click)="editStock(stk)" class="btn btn-sm btn-warning">Edit</button>
                <button (click)="deleteStock(stk.id!)" class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
            <tr *ngIf="stocks.length === 0">
              <td colspan="6" class="no-data">No stocks found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .form-card, .table-card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .form-row { display: flex; gap: 15px; margin-bottom: 15px; }
    .form-group { margin-bottom: 15px; flex: 1; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .form-actions { display: flex; gap: 10px; margin-top: 20px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-warning { background: #ffc107; color: black; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .table th { background: #f8f9fa; font-weight: bold; }
    .no-data { text-align: center; color: #666; font-style: italic; }
  `
})
export class StockComponent implements OnInit {
  stocks: Stock[] = [];
  items: Item[] = [];
  stock: Stock = { itemId: 0, quantity: 0, location: '', lastUpdated: new Date() };
  editingId: number | null = null;
  showForm = false;
  
  constructor(
    private stockService: StockService,
    private itemService: ItemService
  ) {}
  
  ngOnInit() {
    this.loadStocks();
    this.loadItems();
  }
  
  loadStocks() {
    this.stockService.getAll().subscribe({
      next: (data) => this.stocks = data,
      error: (error) => console.error('Error loading stocks:', error)
    });
  }
  
  loadItems() {
    this.itemService.getAll().subscribe({
      next: (data) => this.items = data,
      error: (error) => console.error('Error loading items:', error)
    });
  }
  
  getItemName(itemId: number): string {
    const item = this.items.find(i => i.id === itemId);
    return item ? item.name : 'Unknown';
  }
  
  saveStock() {
    if (!this.stock.itemId || !this.stock.quantity) {
      alert('Please fill all required fields');
      return;
    }
    
    const operation = this.editingId 
      ? this.stockService.update(this.editingId, this.stock)
      : this.stockService.create(this.stock);
    
    operation.subscribe({
      next: () => {
        this.loadStocks();
        this.resetForm();
        alert(`Stock ${this.editingId ? 'updated' : 'created'} successfully`);
      },
      error: (error) => {
        console.error('Error saving stock:', error);
        alert('Error saving stock');
      }
    });
  }
  
  editStock(stk: Stock) {
    this.stock = { ...stk };
    this.editingId = stk.id!;
    this.showForm = true;
  }
  
  deleteStock(id: number) {
    if (confirm('Are you sure you want to delete this stock?')) {
      this.stockService.delete(id).subscribe({
        next: () => {
          this.loadStocks();
          alert('Stock deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting stock:', error);
          alert('Error deleting stock');
        }
      });
    }
  }
  
  cancelEdit() {
    this.resetForm();
  }
  
  resetForm() {
    this.stock = { itemId: 0, quantity: 0, location: '', lastUpdated: new Date() };
    this.editingId = null;
    this.showForm = false;
  }
}
