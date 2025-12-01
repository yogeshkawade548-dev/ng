import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService, Supplier } from '../../services/supplier.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Supplier Management</h2>
        <button (click)="showForm = !showForm" class="btn btn-primary">{{showForm ? 'Cancel' : 'Add Supplier'}}</button>
      </div>
      
      <div *ngIf="showForm" class="form-card">
        <h3>{{editingId ? 'Edit' : 'Add'}} Supplier</h3>
        <form (ngSubmit)="saveSupplier()">
          <div class="form-row">
            <div class="form-group">
              <label>Supplier Name *</label>
              <input [(ngModel)]="supplier.name" name="name" required class="form-control" placeholder="Enter supplier name">
            </div>
            <div class="form-group">
              <label>Contact Person *</label>
              <input [(ngModel)]="supplier.contactPerson" name="contactPerson" required class="form-control" placeholder="Enter contact person">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Phone</label>
              <input [(ngModel)]="supplier.phone" name="phone" class="form-control" placeholder="Enter phone">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input [(ngModel)]="supplier.email" name="email" type="email" class="form-control" placeholder="Enter email">
            </div>
          </div>
          <div class="form-group">
            <label>Address</label>
            <textarea [(ngModel)]="supplier.address" name="address" class="form-control" placeholder="Enter address" rows="3"></textarea>
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
              <th>Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let sup of suppliers">
              <td>{{sup.id}}</td>
              <td>{{sup.name}}</td>
              <td>{{sup.contactPerson}}</td>
              <td>{{sup.phone}}</td>
              <td>{{sup.email}}</td>
              <td>{{sup.address}}</td>
              <td>
                <button (click)="editSupplier(sup)" class="btn btn-sm btn-warning">Edit</button>
                <button (click)="deleteSupplier(sup.id!)" class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
            <tr *ngIf="suppliers.length === 0">
              <td colspan="7" class="no-data">No suppliers found</td>
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
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  supplier: Supplier = { name: '', contactPerson: '', phone: '', email: '', address: '' };
  editingId: number | null = null;
  showForm = false;
  
  constructor(private supplierService: SupplierService) { debugger; console.log('suppliers.component loaded');}
  
  ngOnInit() {
    this.loadSuppliers();
  }
  
  loadSuppliers() {
    this.supplierService.getAll().subscribe({
      next: (data) => this.suppliers = data,
      error: (error) => console.error('Error loading suppliers:', error)
    });
  }
  
  saveSupplier() {
    if (!this.supplier.name.trim() || !this.supplier.contactPerson.trim()) {
      alert('Please fill all required fields');
      return;
    }
    
    const operation = this.editingId 
      ? this.supplierService.update(this.editingId, this.supplier)
      : this.supplierService.create(this.supplier);
    
    operation.subscribe({
      next: () => {
        this.loadSuppliers();
        this.resetForm();
        alert(`Supplier ${this.editingId ? 'updated' : 'created'} successfully`);
      },
      error: (error) => {
        console.error('Error saving supplier:', error);
        alert('Error saving supplier');
      }
    });
  }
  
  editSupplier(sup: Supplier) {
    this.supplier = { ...sup };
    this.editingId = sup.id!;
    this.showForm = true;
  }
  
  deleteSupplier(id: number) {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.delete(id).subscribe({
        next: () => {
          this.loadSuppliers();
          alert('Supplier deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting supplier:', error);
          alert('Error deleting supplier');
        }
      });
    }
  }
  
  cancelEdit() {
    this.resetForm();
  }
  
  resetForm() {
    this.supplier = { name: '', contactPerson: '', phone: '', email: '', address: '' };
    this.editingId = null;
    this.showForm = false;
  }
}
