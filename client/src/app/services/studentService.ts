import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  // Fetch all branches
  getBranches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches`);
  }
  getLessons(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesson`);
  }
  getStudentByLessons(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesStudents/lesson/${lessonCode}`);
  }
  getStudentByLessonsStudent(lessonCode: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/lesStudents/lesson/student/${lessonCode}`
    );
  }

  getStudentByCode(studentCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesStudents/student/${studentCode}`);
  }

  getDepartments(branchId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches/${branchId}/departments`);
  }

  // Register a new teacher
  registerStudent(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/student`, studentData);
  }

  // Register a new teacher
  registerLesStudent(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lesStudents/upload`, studentData);
  }

  getStudentId(id: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/findById`, { id });
  }

  getStudents(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesStudents/${lessonCode}`);
  }

  updateStudents(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lesStudents/update`, studentData);
  }

  getStudentByClasstypeAndDay(
    lessonCode: string,
    classType: string,
    day: string
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/lesStudents/${lessonCode}/classType/${classType}?day=${day}`
    );
  }

  getStudentByClasstypeAndDayTime(
    classType: string,
    day: string,
    time: number,
    lessonCode: string
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/lesStudents/${lessonCode}/classTypeDateTime/${classType}?day=${day}&time=${time}`
    );
  }

  getCloList(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clos/${id}`);
  }

  deleteLesStudents(id: any) {
    return this.http.delete(`${this.apiUrl}/lesStudents/${id}`);
  }
}
