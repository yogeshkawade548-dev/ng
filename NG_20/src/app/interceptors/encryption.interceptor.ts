import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { EncryptionService } from '../services/encryption.service';

export const encryptionInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const encryptionService = inject(EncryptionService);
  
  let modifiedReq = req;
  
  // Encrypt request body for POST/PUT requests (except login)
  if ((req.method === 'POST' || req.method === 'PUT') && req.body && !req.url.includes('/auth/login')) {
    try {
      const encryptedBody = encryptionService.encrypt(req.body);
      modifiedReq = req.clone({
        body: { data: encryptedBody },
        setHeaders: {
          'Content-Type': 'application/json',
          'X-Encrypted': 'true'
        }
      });
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  }
  
  return next(modifiedReq).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        // Check if response is encrypted
        if (event.headers.get('X-Encrypted') === 'true' || (event.body && typeof event.body === 'object' && (event.body as any)?.data)) {
          try {
            const encryptedData = (event.body as any)?.data;
            if (encryptedData) {
              const decryptedData = encryptionService.decrypt(encryptedData);
              return event.clone({ body: decryptedData });
            }
          } catch (error) {
            console.error('Decryption failed:', error);
          }
        }
      }
      return event;
    })
  );
};
