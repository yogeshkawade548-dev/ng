import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  captcha1 = '';
  captcha2 = '';
  captcha3 = '';
  captcha4 = '';
  captcha5 = '';
  errorMessage = signal('');
  showPassword = signal(false);
  captchaText = signal('');

  constructor(private authService: AuthService, private router: Router) { debugger; console.log('login.component loaded');
    debugger;
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = '';
    
    // Ensure at least 2 capital letters and 2 numbers
    result += capitals.charAt(Math.floor(Math.random() * capitals.length));
    result += capitals.charAt(Math.floor(Math.random() * capitals.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    
    // Add one more random character
    const allChars = capitals + numbers;
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    
    // Shuffle the result using Fisher-Yates algorithm
    const chars = result.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    result = chars.join('');
    this.captchaText.set(result);
  }

  onLogin(): void {
    debugger;
    const enteredCaptcha = this.captcha1 + this.captcha2 + this.captcha3 + this.captcha4 + this.captcha5;
    
    if (enteredCaptcha.toUpperCase() !== this.captchaText().toUpperCase()) {
      this.errorMessage.set('Invalid captcha');
      this.generateCaptcha();
      this.clearCaptcha();
      return;
    }
    
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful, response:', response);
        this.errorMessage.set('');
        // Manually set auth state and navigate
        const user = response.user;
        const token = response.token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        this.authService.currentUser.set(user);
        this.authService.isLoggedIn.set(true);
        
        console.log('Manually set auth state - isLoggedIn:', this.authService.isLoggedIn());
        console.log('Token exists:', !!localStorage.getItem('token'));
        
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        let errorMsg = 'Login failed';
        if (error.status === 401) {
          errorMsg = 'Invalid username or password';
        } else if (error.status === 0) {
          errorMsg = 'Cannot connect to server. Check if API is running.';
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        }
        
        this.errorMessage.set(errorMsg);
        this.generateCaptcha();
        this.clearCaptcha();
      }
    });
  }

  clearCaptcha(): void {
    this.captcha1 = '';
    this.captcha2 = '';
    this.captcha3 = '';
    this.captcha4 = '';
    this.captcha5 = '';
  }

  handleBackspace(event: any, prevField?: any): void {
    if (event.key === 'Backspace' && event.target.value === '' && prevField) {
      prevField.focus();
    }
  }

  moveToNext(event: any, nextField?: any): void {
    if (event.target.value.length === 1 && nextField) {
      nextField.focus();
    }
    
    // Auto-login when all captcha fields are filled
    if (this.captcha1 && this.captcha2 && this.captcha3 && this.captcha4 && this.captcha5) {
      setTimeout(() => this.onLogin(), 100);
    }
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
