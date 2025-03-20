import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  getBranches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches`);
  }

  getDepartments(branchId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches/${branchId}/departments`);
  }

  registerLessonMainInfo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teachers`, data);
  }

  saveLesson(data: any) {
    return this.http.post(`${this.apiUrl}/lesson`, data);
  }

  getLessons() {
    return this.http.get(`${this.apiUrl}/lessons`);
  }

  getLessonById(id: string) {
    return this.http.get(`${this.apiUrl}/lessons/${id}`);
  }

  updateLesson(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/lessons/${id}`, data);
  }

  deleteLesson(id: string) {
    return this.http.delete(`${this.apiUrl}/lessons/${id}`);
  }

}
