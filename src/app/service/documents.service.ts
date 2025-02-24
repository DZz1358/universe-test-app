import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private http = inject(HttpClient);
  constructor() { }

  getDocuments(data: any) {
    return this.http.get(`${environment.apiUrl}/document`, {
      params: data
    });
  }

  getDocument(id: string) {
    return this.http.get(`${environment.apiUrl}/document/${id}`)
  }

  createDocument(data: any) {
    let formData = new FormData()

    formData.append('name', data.name)
    formData.append('status', data.status)
    formData.append('file', data.file)

    return this.http.post(`${environment.apiUrl}/document`, formData)
  }
}
