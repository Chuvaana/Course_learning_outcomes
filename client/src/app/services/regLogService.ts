import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegLogService {
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

  // Register a new teacher
  findGmailTeacher(gmail: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/teachers/gmail/${gmail}`);
  }

  changePassword(teacherId: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teachers/changePassword/${teacherId}`, data);
  }

  loginTeacher(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teachers/login`, loginData);
  }

  loginStudent(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/login`, loginData);
  }


  registerStudent(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/student`, loginData);
  }

  findGmailStudent(gmail: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/gmail/${gmail}`);
  }

  changePasswordStudent(studentId: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/student/changePassword/${studentId}`, data);
  }
}
