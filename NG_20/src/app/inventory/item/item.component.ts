import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService, Item } from '../../services/item.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements OnInit {
  items: Item[] = [];
  categories: Category[] = [];
  item: Item = { name: '', description: '', categoryId: 0, price: 0, quantity: 0 };
  editingId: number | null = null;
  showForm = false;
  
  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService
  ) {}
  
  ngOnInit() {
    this.loadItems();
    this.loadCategories();
  }
  
  loadItems() {
    this.itemService.getAll().subscribe({
      next: (data) => this.items = data,
      error: (error) => console.error('Error loading items:', error)
    });
  }
  
  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Error loading categories:', error)
    });
  }
  
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }
  
  saveItem() {
    if (!this.item.name.trim() || !this.item.categoryId || !this.item.price || !this.item.quantity) {
      alert('Please fill all required fields');
      return;
    }
    
    const operation = this.editingId 
      ? this.itemService.update(this.editingId, this.item)
      : this.itemService.create(this.item);
    
    operation.subscribe({
      next: () => {
        this.loadItems();
        this.resetForm();
        alert(`Item ${this.editingId ? 'updated' : 'created'} successfully`);
      },
      error: (error) => {
        console.error('Error saving item:', error);
        alert('Error saving item');
      }
    });
  }
  
  editItem(itm: Item) {
    this.item = { ...itm };
    this.editingId = itm.id!;
    this.showForm = true;
  }
  
  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.delete(id).subscribe({
        next: () => {
          this.loadItems();
          alert('Item deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          alert('Error deleting item');
        }
      });
    }
  }
  
  cancelEdit() {
    this.resetForm();
  }
  
  resetForm() {
    this.item = { name: '', description: '', categoryId: 0, price: 0, quantity: 0 };
    this.editingId = null;
    this.showForm = false;
  }
}
