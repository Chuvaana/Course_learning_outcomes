import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
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
  registerStudent(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lesStudents/upload`, studentData);
  }

  getStudents(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesStudents/${lessonCode}`);
  }

  updateStudents(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lesStudents/update`, studentData);
  }

  getStudentByClasstypeAndDay(classType: string, day: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesStudents/classType/${classType}?day=${day}`);
  }

  getStudentByClasstypeAndDayTime(classType: string, day: string, time: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesStudents/classTypeDateTime/${classType}?day=${day}&time=${time}`);
  }
  
}
