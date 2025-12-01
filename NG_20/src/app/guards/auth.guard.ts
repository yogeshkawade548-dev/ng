import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard = () => {
  debugger;
  console.log('Auth guard checking authentication');
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    const isLoggedIn = authService.isLoggedIn();
    console.log('Auth guard - token exists:', !!token, 'isLoggedIn:', isLoggedIn);
    if (token && isLoggedIn) {
      console.log('Auth guard - access granted');
      return true;
    }
  }

  console.log('Auth guard - redirecting to login');
  router.navigate(['/login']);
  return false;
};

export const loginGuard = () => {
  debugger;
  console.log('Login guard checking if already authenticated');
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = authService.getToken();
  const isLoggedIn = authService.isLoggedIn();
  console.log('Login guard - token:', !!token, 'isLoggedIn:', isLoggedIn);
  if (!token || !isLoggedIn) {
    console.log('Login guard - allowing access to login page');
    return true;
  }

  console.log('Login guard - redirecting to dashboard');
  router.navigate(['/dashboard']);
  return false;
};
