import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  storageService = inject(StorageService)

  constructor() { }

  isReviewer(): boolean {
    const user = this.storageService.getFromLocalStore('user');
    return user?.role === 'REVIEWER';
  }
}
