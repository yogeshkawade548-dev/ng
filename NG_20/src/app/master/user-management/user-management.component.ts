import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UserService, User } from '../../services/user.service';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  showAddForm = false;
  showEditForm = false;
  searchTerm = '';
  nameFilter = '';
  emailFilter = '';
  mobileFilter = '';
  roleFilter = '';
  currentPage = 1;
  itemsPerPage = 5;
  users: User[] = [];
  roles: any[] = [];
  selectedUser: any = {};
  errorMessage = '';
  successMessage = '';
  displayedColumns: string[] = ['name', 'email', 'mobile', 'role', 'status', 'actions'];


  newUser: any = {
    name: '',
    email: '',
    username: '',
    mobile: '',
    role: '',
    isActive: true
  };
  
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }
  
  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (error) => console.error('Error loading roles:', error)
    });
  }
  
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.errorMessage = '';
      },
      error: (error) => {
        this.users = [];
        this.errorMessage = 'Failed to load users. Please try again.';
      }
    });
  }
  
  get filteredUsers() {
    return this.users.filter(user => {
      const nameMatch = !this.nameFilter || user?.name?.toLowerCase().includes(this.nameFilter.toLowerCase());
      const emailMatch = !this.emailFilter || user?.email?.toLowerCase().includes(this.emailFilter.toLowerCase());
      const mobileMatch = !this.mobileFilter || user?.mobile?.includes(this.mobileFilter);
      const roleMatch = !this.roleFilter || user?.role === this.roleFilter;
      
      return nameMatch && emailMatch && mobileMatch && roleMatch;
    });
  }
  
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages() {
    return this.itemsPerPage > 0 ? Math.ceil(this.filteredUsers.length / this.itemsPerPage) : 1;
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
  
  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully';
          this.errorMessage = '';
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user. Please try again.';
          this.successMessage = '';
        }
      });
    }
  }

  testApi() {
    this.loadUsers();
  }

  editUser(user: User) {
    this.selectedUser = { 
      ...user,
      role: user.role // Ensure role is properly set for the dropdown
    };
    this.showEditForm = true;
  }

  updateUser() {
    if (!this.selectedUser || !this.selectedUser.id) {
      this.errorMessage = 'Invalid user selected for update';
      this.successMessage = '';
      return;
    }
    
    // Validate required fields
    if (!this.selectedUser.name || !this.selectedUser.email || !this.selectedUser.username || !this.selectedUser.role) {
      this.errorMessage = 'Please fill all required fields';
      this.successMessage = '';
      return;
    }
    
    console.log('Updating user:', this.selectedUser);
    this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
      next: (response) => {
        this.successMessage = 'User updated successfully';
        this.errorMessage = '';
        this.showEditForm = false;
        this.loadUsers();
      },
      error: (error) => {
        console.error('Update error:', error);
        this.errorMessage = 'Failed to update user. Please try again.';
        this.successMessage = '';
      }
    });
  }

  saveUser() {
    // Validate required fields
    if (!this.newUser.name || !this.newUser.email || !this.newUser.username || !this.newUser.mobile || !this.newUser.role) {
      this.errorMessage = 'Please fill all required fields';
      this.successMessage = '';
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newUser.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.successMessage = '';
      return;
    }
    
    // Validate mobile format (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(this.newUser.mobile)) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number';
      this.successMessage = '';
      return;
    }
    
    this.userService.createUser(this.newUser).subscribe({
      next: (response) => {
        this.successMessage = 'User created successfully';
        this.errorMessage = '';
        this.showAddForm = false;
        this.resetNewUser();
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage = 'Failed to create user. Please try again.';
        this.successMessage = '';
      }
    });
  }

  resetNewUser() {
    this.newUser = {
      name: '',
      email: '',
      username: '',
      mobile: '',
      role: '',
      isActive: true
    };
  }

  clearForm() {
    this.resetNewUser();
  }

  clearFilters() {
    this.nameFilter = '';
    this.emailFilter = '';
    this.mobileFilter = '';
    this.roleFilter = '';
    this.currentPage = 1;
  }
}
