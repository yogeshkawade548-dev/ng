import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderService, PurchaseOrder } from '../../services/purchase-order.service';
import { SupplierService, Supplier } from '../../services/supplier.service';

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Purchase Order Management</h2>
        <button (click)="showForm = !showForm" class="btn btn-primary">{{showForm ? 'Cancel' : 'Add Order'}}</button>
      </div>
      
      <div *ngIf="showForm" class="form-card">
        <h3>{{editingId ? 'Edit' : 'Add'}} Purchase Order</h3>
        <form (ngSubmit)="savePurchaseOrder()">
          <div class="form-row">
            <div class="form-group">
              <label>Supplier *</label>
              <select [(ngModel)]="purchaseOrder.supplierId" name="supplierId" required class="form-control">
                <option value="">Select Supplier</option>
                <option *ngFor="let sup of suppliers" [value]="sup.id">{{sup.name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Order Date *</label>
              <input [(ngModel)]="purchaseOrder.orderDate" name="orderDate" type="date" required class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Total Amount *</label>
              <input [(ngModel)]="purchaseOrder.totalAmount" name="totalAmount" type="number" step="0.01" required class="form-control" placeholder="Enter total amount">
            </div>
            <div class="form-group">
              <label>Status *</label>
              <select [(ngModel)]="purchaseOrder.status" name="status" required class="form-control">
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
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
              <th>Supplier</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let po of purchaseOrders">
              <td>{{po.id}}</td>
              <td>{{getSupplierName(po.supplierId)}}</td>
              <td>{{po.orderDate | date}}</td>
              <td>{{po.totalAmount | currency}}</td>
              <td><span class="status-badge status-{{po.status.toLowerCase()}}">{{po.status}}</span></td>
              <td>
                <button (click)="editPurchaseOrder(po)" class="btn btn-sm btn-warning">Edit</button>
                <button (click)="deletePurchaseOrder(po.id!)" class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
            <tr *ngIf="purchaseOrders.length === 0">
              <td colspan="6" class="no-data">No purchase orders found</td>
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
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .status-pending { background: #ffc107; color: black; }
    .status-approved { background: #28a745; color: white; }
    .status-delivered { background: #007bff; color: white; }
    .status-cancelled { background: #dc3545; color: white; }
  `
})
export class PurchaseOrderComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  suppliers: Supplier[] = [];
  purchaseOrder: PurchaseOrder = { supplierId: 0, orderDate: new Date(), totalAmount: 0, status: '' };
  editingId: number | null = null;
  showForm = false;
  
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService
  ) {}
  
  ngOnInit() {
    this.loadPurchaseOrders();
    this.loadSuppliers();
  }
  
  loadPurchaseOrders() {
    this.purchaseOrderService.getAll().subscribe({
      next: (data) => this.purchaseOrders = data,
      error: (error) => console.error('Error loading purchase orders:', error)
    });
  }
  
  loadSuppliers() {
    this.supplierService.getAll().subscribe({
      next: (data) => this.suppliers = data,
      error: (error) => console.error('Error loading suppliers:', error)
    });
  }
  
  getSupplierName(supplierId: number): string {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown';
  }
  
  savePurchaseOrder() {
    if (!this.purchaseOrder.supplierId || !this.purchaseOrder.totalAmount || !this.purchaseOrder.status) {
      alert('Please fill all required fields');
      return;
    }
    
    const operation = this.editingId 
      ? this.purchaseOrderService.update(this.editingId, this.purchaseOrder)
      : this.purchaseOrderService.create(this.purchaseOrder);
    
    operation.subscribe({
      next: () => {
        this.loadPurchaseOrders();
        this.resetForm();
        alert(`Purchase Order ${this.editingId ? 'updated' : 'created'} successfully`);
      },
      error: (error) => {
        console.error('Error saving purchase order:', error);
        alert('Error saving purchase order');
      }
    });
  }
  
  editPurchaseOrder(po: PurchaseOrder) {
    this.purchaseOrder = { ...po };
    this.editingId = po.id!;
    this.showForm = true;
  }
  
  deletePurchaseOrder(id: number) {
    if (confirm('Are you sure you want to delete this purchase order?')) {
      this.purchaseOrderService.delete(id).subscribe({
        next: () => {
          this.loadPurchaseOrders();
          alert('Purchase Order deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting purchase order:', error);
          alert('Error deleting purchase order');
        }
      });
    }
  }
  
  cancelEdit() {
    this.resetForm();
  }
  
  resetForm() {
    this.purchaseOrder = { supplierId: 0, orderDate: new Date(), totalAmount: 0, status: '' };
    this.editingId = null;
    this.showForm = false;
  }
}
