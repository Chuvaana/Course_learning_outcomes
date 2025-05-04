import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  saveAssessmentMethod(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assessment-plan`, data);
  }

  updateAssessmentMethod(lessonId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/assessment-plan/${lessonId}`, data);
  }

  getAssessmentByLesson(lessonId: any) {
    return this.http.get(`${this.apiUrl}/assessment-plan/${lessonId}`);
  }

  getAssessmentByLessonAndId(lessonId: string, planId: string) {
    return this.http.get(
      `${this.apiUrl}/assessment-plan/${lessonId}/planId/${planId}`
    );
  }

  // createAssessment(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/assessments`, data);
  // }

  // updateAssessment(id: string, data: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/assessments/${id}`, data);
  // }

  // getAssessment(id: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/assessments/${id}`);
  // }

  getCloList(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clos/${id}`);
  }

  createAssessFooter(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assessFooters`, data);
  }

  updateAssessFooter(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/assessFooters/${id}`, data);
  }

  getAssessFooter(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessFooters/${id}`);
  }

  getSchedules(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/schedules/${lessonCode}`);
  }

  getScheduleSems(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/scheduleSems/${lessonCode}`);
  }

  getScheduleLabs(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/scheduleLabs/${lessonCode}`);
  }

  getScheduleBds(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/scheduleBds/${lessonCode}`);
  }

  getAdditional(lessonCode: string) {
    return this.http.get(`${this.apiUrl}/additionals/${lessonCode}`);
  }
  getMainInfo(id: string) {
    return this.http.get(`${this.apiUrl}/lesson/${id}`);
  }

  getMaterials(lessonCode: string) {
    console.log(lessonCode + 'fff');
    return this.http.get(`${this.apiUrl}/materials/${lessonCode}`);
  }

  getMethod(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/methodologys/${id}`);
  }

  getDefinition(lessonId: string) {
    return this.http.get(`${this.apiUrl}/definitions/${lessonId}`);
  }
}
