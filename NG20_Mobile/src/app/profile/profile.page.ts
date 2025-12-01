import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: any;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    debugger;
    console.log('ProfilePage ngOnInit called');
    this.loadUserData();
  }

  loadUserData() {
    debugger;
    console.log('loadUserData called');
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    console.log('Stored user:', storedUser);
    
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        console.log('Parsed user:', this.user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.user = null;
      }
    }
    
    // Always subscribe to AuthService for updates
    this.authService.currentUser$.subscribe(user => {
      console.log('AuthService user:', user);
      if (user && !this.user) {
        this.user = user;
      }
    });
  }

  getUserName(): string {
    debugger;
    const name = this.user?.name || this.user?.username || this.user?.firstName || 'User';
    console.log('getUserName:', name, 'user:', this.user);
    return name;
  }

  getUserEmail(): string {
    debugger;
    const email = this.user?.email || 'No email';
    console.log('getUserEmail:', email, 'user:', this.user);
    return email;
  }

  getUserRole(): string {
    debugger;
    const role = this.user?.role || this.user?.roleName || 'User';
    console.log('getUserRole:', role, 'user:', this.user);
    return role;
  }

  getDaysActive(): number {
    debugger;
    console.log('getDaysActive called, user:', this.user);
    if (this.user?.createdDate) {
      const created = new Date(this.user.createdDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - created.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 30;
  }

  async editProfile() {
    debugger;
    console.log('editProfile called, user:', this.user);
    const alert = await this.alertController.create({
      header: 'Edit Profile',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Full Name',
          value: this.user?.name || this.user?.username || ''
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
          value: this.user?.email || ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            debugger;
            console.log('Save profile data:', data);
            this.showToast('Profile updated successfully');
          }
        }
      ]
    });
    await alert.present();
  }

  async changePassword() {
    debugger;
    console.log('changePassword called');
    const alert = await this.alertController.create({
      header: 'Change Password',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Current Password'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'New Password'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirm New Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change',
          handler: (data) => {
            debugger;
            console.log('Change password data:', data);
            if (data.newPassword === data.confirmPassword) {
              this.showToast('Password changed successfully');
            } else {
              this.showToast('Passwords do not match', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async openSettings() {
    debugger;
    console.log('openSettings called');
    const alert = await this.alertController.create({
      header: 'Settings',
      message: 'App settings and preferences',
      buttons: ['OK']
    });
    await alert.present();
  }

  async openNotifications() {
    debugger;
    console.log('openNotifications called');
    const alert = await this.alertController.create({
      header: 'Notifications',
      message: 'Manage your notification preferences',
      buttons: ['OK']
    });
    await alert.present();
  }

  async openHelp() {
    debugger;
    console.log('openHelp called');
    const alert = await this.alertController.create({
      header: 'Help & Support',
      message: 'Contact support: support@ng20.com\nPhone: +1-234-567-8900',
      buttons: ['OK']
    });
    await alert.present();
  }

  async openAbout() {
    debugger;
    console.log('openAbout called');
    const alert = await this.alertController.create({
      header: 'About NG20',
      message: 'Version: 1.0.0\nInventory Management System\n© 2024 NG20 Technologies',
      buttons: ['OK']
    });
    await alert.present();
  }

  async showToast(message: string, color: string = 'success') {
    debugger;
    console.log('showToast called:', message, color);
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  logout() {
    debugger;
    console.log('logout called');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
