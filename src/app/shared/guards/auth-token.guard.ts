import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { StorageService } from '../../service/storage.service';

export const authTokenGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const hasToken = !!storageService.checkInLocalStore('access_token');

  if (!hasToken) {
    router.navigate(['/login']);
  }

  return hasToken;
};
