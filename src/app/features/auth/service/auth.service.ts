import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  constructor() { }


  login(data: any) {
    return this.http.post(`${environment.apiUrl}/auth/login`, data);
  }

  registration(data: any) {
    return this.http.post(`${environment.apiUrl}/user/register`, data);
  }
}
