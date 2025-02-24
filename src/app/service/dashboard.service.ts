import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  constructor() { }

  getDocuments(data: any) {
    return this.http.get(`${environment.apiUrl}/document`, {
      params: data
    });
  }
}
