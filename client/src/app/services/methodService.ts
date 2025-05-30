import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MethodService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  createMethod(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/methodologys`, data);
  }

  createMethods(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/methodologys/all`, data);
  }

  updateMethod(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/methodologys/${data.id}`, data);
  }

  deleteMethod(id: string) {
    return this.http.delete(`${this.apiUrl}/methodologys/${id}`);
  }

  getMethod(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/methodologys/${id}`);
  }
}
