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
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 5;
  
  constructor(private categoryService: CategoryService, private dialog: MatDialog) {}
  
  ngOnInit() {
    this.loadCategories();
  }
  
  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = data;
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }
  
  applyFilter() {
    if (!this.searchTerm) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
  }
  
  get paginatedCategories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages() {
    return this.itemsPerPage > 0 ? Math.ceil(this.filteredCategories.length / this.itemsPerPage) : 1;
  }
  
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
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  openDialog(category?: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: category ? { ...category } : { name: '', description: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
        this.applyFilter();
      }
    });
  }
  
  editCategory(cat: Category) {
    this.openDialog(cat);
  }
  
  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.loadCategories();
          alert('Category deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Error deleting category');
        }
      });
    }
  }
}

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{data.id ? 'Edit' : 'Add'}} Category</h2>
    <mat-dialog-content>
      <form (ngSubmit)="save()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category Name</mat-label>
          <input matInput [(ngModel)]="data.name" name="name" required>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <input matInput [(ngModel)]="data.description" name="description">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()">{{data.id ? 'Update' : 'Save'}}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 16px; }
    mat-dialog-content { min-height: 150px; }
  `]
})
export class CategoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private categoryService: CategoryService
  ) {}

  save() {
    if (!this.data.name.trim()) {
      alert('Category name is required');
      return;
    }

    const operation = this.data.id 
      ? this.categoryService.update(this.data.id, this.data)
      : this.categoryService.create(this.data);

    operation.subscribe({
      next: () => {
        alert(`Category ${this.data.id ? 'updated' : 'created'} successfully`);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error saving category:', error);
        alert('Error saving category');
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
