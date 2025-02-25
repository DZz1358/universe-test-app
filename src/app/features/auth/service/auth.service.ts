import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RegisterResponse } from '../../../shared/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  login(data: RegisterResponse) {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/login`, data);
  }

  registration(data: RegisterResponse) {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/user/register`, data);
  }
}
