import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PloService {
  private apiUrl = 'http://localhost:3000/api/plo';

  constructor(private http: HttpClient) {}

  addPlo(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getPlos() {
    return this.http.get(`${this.apiUrl}`);
  }

  updateplo(lessonId: string, data: any) {
    return this.http.put(`${this.apiUrl}/${lessonId}`, data);
  }
}
