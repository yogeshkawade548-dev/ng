import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-encryption',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.css']
})
export class EncryptionComponent {
  inputData: string = '';
  encryptedData: string = '';
  decryptedData: string = '';
  loading: boolean = false;
  
  private apiUrl = 'https://localhost:44335/api/encryption';

  constructor(private http: HttpClient) {}

  encrypt() {
    if (!this.inputData.trim()) {
      alert('Please enter data to encrypt');
      return;
    }

    this.loading = true;
    this.http.post<any>(`${this.apiUrl}/encrypt`, { data: this.inputData })
      .subscribe({
        next: (response) => {
          this.encryptedData = response.encrypted;
          this.loading = false;
        },
        error: (error) => {
          console.error('Encryption failed:', error);
          alert('Encryption failed');
          this.loading = false;
        }
      });
  }

  decrypt() {
    if (!this.encryptedData.trim()) {
      alert('Please enter encrypted data to decrypt');
      return;
    }

    this.loading = true;
    this.http.post<any>(`${this.apiUrl}/decrypt`, { encryptedData: this.encryptedData })
      .subscribe({
        next: (response) => {
          this.decryptedData = response.decrypted;
          this.loading = false;
        },
        error: (error) => {
          console.error('Decryption failed:', error);
          alert('Decryption failed');
          this.loading = false;
        }
      });
  }

  clear() {
    this.inputData = '';
    this.encryptedData = '';
    this.decryptedData = '';
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    });
  }
}