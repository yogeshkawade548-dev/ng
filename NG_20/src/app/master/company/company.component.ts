import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyService, Company } from '../../services/company.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit {
  companies: Company[] = [];
  displayedColumns: string[] = ['name', 'address', 'phone', 'actions'];
  nameFilter = '';
  addressFilter = '';
  phoneFilter = '';
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 5;
  
  get filteredCompanies() {
    return this.companies.filter(company => {
      const nameMatch = !this.nameFilter || company?.name?.toLowerCase().includes(this.nameFilter.toLowerCase());
      const addressMatch = !this.addressFilter || company?.address?.toLowerCase().includes(this.addressFilter.toLowerCase());
      const phoneMatch = !this.phoneFilter || company?.phone?.includes(this.phoneFilter);
      
      return nameMatch && addressMatch && phoneMatch;
    });
  }
  
  get paginatedCompanies() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCompanies.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages() {
    return Math.ceil(this.filteredCompanies.length / this.itemsPerPage);
  }
  
  constructor(private companyService: CompanyService, private dialog: MatDialog) {}
  
  ngOnInit() {
    this.loadCompanies();
  }
  
  loadCompanies() {
    this.companyService.getAll().subscribe({
      next: (data) => this.companies = data,
      error: (error) => console.error('Error loading companies:', error)
    });
  }
  
  openDialog(company?: Company) {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '400px',
      data: company ? { ...company } : { name: '', address: '', phone: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompanies();
      }
    });
  }
  
  editCompany(comp: Company) {
    this.openDialog(comp);
  }
  
  deleteCompany(id: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.delete(id).subscribe({
        next: () => {
          this.loadCompanies();
          alert('Company deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting company:', error);
          alert('Error deleting company');
        }
      });
    }
  }
  

  
  // Pagination methods
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  goToPage(page: number) {
    this.currentPage = page;
  }

  clearFilters() {
    this.nameFilter = '';
    this.addressFilter = '';
    this.phoneFilter = '';
    this.currentPage = 1;
  }
}

@Component({
  selector: 'app-company-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{data.id ? 'Edit' : 'Add'}} Company</h2>
    <mat-dialog-content>
      <form #companyForm="ngForm" (ngSubmit)="save()">
        <div class="form-group">
          <label class="form-label">Company Name</label>
          <mat-form-field appearance="outline" class="full-width">
            <input matInput [(ngModel)]="data.name" name="name" required minlength="2" #nameField="ngModel">
          </mat-form-field>
          <div *ngIf="nameField.invalid && nameField.touched" class="error-message">
            <small *ngIf="nameField.errors?.['required']">Company name is required</small>
            <small *ngIf="nameField.errors?.['minlength']">Company name must be at least 2 characters</small>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Phone</label>
          <mat-form-field appearance="outline" class="full-width">
            <input matInput [(ngModel)]="data.phone" name="phone" pattern="[0-9+\-\s()]+" #phoneField="ngModel">
          </mat-form-field>
          <div *ngIf="phoneField.invalid && phoneField.touched" class="error-message">
            <small *ngIf="phoneField.errors?.['pattern']">Please enter a valid phone number</small>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Address</label>
          <mat-form-field appearance="outline" class="full-width">
            <input matInput [(ngModel)]="data.address" name="address" #addressField="ngModel">
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="!companyForm.valid" (click)="save()">{{data.id ? 'Update' : 'Save'}}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 0; }
    mat-dialog-content { min-height: 200px; }
    .form-group { margin-bottom: 4px; }
    .form-label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 14px; }
    .error-message { color: #e74c3c; font-size: 0.8rem; margin-top: -0.25rem; }
    .error-message small { display: block; }
    ::ng-deep .mat-mdc-form-field { height: 40px !important; }
    ::ng-deep .mat-mdc-text-field-wrapper { height: 32px !important; }
    ::ng-deep .mdc-text-field { height: 32px !important; }
    ::ng-deep .mat-mdc-form-field-infix { min-height: 32px !important; padding: 4px 0 !important; }
  `]
})
export class CompanyDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Company,
    private companyService: CompanyService
  ) {}

  save() {
    if (!this.data.name.trim()) {
      alert('Company name is required');
      return;
    }

    const operation = this.data.id 
      ? this.companyService.update(this.data.id, this.data)
      : this.companyService.create(this.data);

    operation.subscribe({
      next: () => {
        alert(`Company ${this.data.id ? 'updated' : 'created'} successfully`);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error saving company:', error);
        alert('Error saving company');
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
