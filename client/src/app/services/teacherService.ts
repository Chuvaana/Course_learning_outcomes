import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

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

  assignLesson(lessonId: string): Observable<any> {
    const teacherId = localStorage.getItem('teacherId'); // Get token from localStorage
    return this.http.post(`${this.apiUrl}/teachers/assign-lesson`, { teacherId, lessonId });
  }

  getLessons(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesson`);
  }

  getTeacher(teacherId: string): Observable<any> { // Get token from localStorage
    return this.http.get(`${this.apiUrl}/teachers/${teacherId}`);
  }

  getCloList(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clos/${id}`);
  }

  registerClo(cloData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clos`, cloData);
  }

  updateClo(cloData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clos/${cloData.id}`, cloData);
  }

  getTeacherLessons(teacherId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/teachers/${teacherId}/lessons`);
  }
}
