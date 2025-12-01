import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = 'MySecretKey123!@#00000000000000000'.substring(0, 32);

  encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      const key = CryptoJS.enc.Utf8.parse(this.secretKey);
      const iv = CryptoJS.lib.WordArray.random(16);
      
      const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      const combined = iv.concat(encrypted.ciphertext);
      return CryptoJS.enc.Base64.stringify(combined);
    } catch (error) {
      console.error('Encryption error:', error);
      return JSON.stringify(data);
    }
  }

  decrypt(encryptedData: string): any {
    try {
      const key = CryptoJS.enc.Utf8.parse(this.secretKey);
      const combined = CryptoJS.enc.Base64.parse(encryptedData);
      
      const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));
      const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));
      
      const decrypted = CryptoJS.AES.decrypt(
        CryptoJS.enc.Base64.stringify(ciphertext),
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  }
}
