import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IResponse, IUser } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getUser(): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiUrl}/user`);
  }

  getUsersList(): Observable<IResponse> {
    return this.http.get<IResponse>(`${environment.apiUrl}/user/users?page=1&size=100`);
  }
}
