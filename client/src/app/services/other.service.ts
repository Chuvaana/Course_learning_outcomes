import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OtherService {
  private apiUrl = 'http://localhost:3000/api/definitions';

  constructor(private http: HttpClient) {}

  addDefinition(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getDefinition(lessonId: string) {
    return this.http.get(`${this.apiUrl}/${lessonId}`);
  }

  updateDefinition(lessonId: string, data: any) {
    return this.http.put(`${this.apiUrl}/${lessonId}`, data);
  }

}
