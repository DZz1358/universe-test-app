import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setToLocalStore(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStore(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeFromLocalStore(key: string): void {
    localStorage.removeItem(key);
  }

  checkInLocalStore(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
