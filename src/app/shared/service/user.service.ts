import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  constructor() { }

  getUser() {
    return this.http.get(`${environment.apiUrl}/user`);
  }

  getUsersList() {
    return this.http.get(`${environment.apiUrl}/user/users?page=1&size=100`);
  }
}
