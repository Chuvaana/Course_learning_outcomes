import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  // Fetch all branches
  getBranches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches`);
  }

  // Fetch departments by branch ID
  getDepartments(branchId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches/${branchId}/departments`);
  }

  // Register a new teacher
  registerTeacher(teacherData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teachers`, teacherData);
  }

  assignLesson(teacherId: string, lessonId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-lesson`, { teacherId, lessonId });
  }
}
