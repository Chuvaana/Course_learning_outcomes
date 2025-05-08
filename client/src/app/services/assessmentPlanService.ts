import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssessmentPlanService {
  private apiUrl = 'http://localhost:3000/api/assessmentPlan';

  constructor(private http: HttpClient) {}

  addAssessmentPlan(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAssessmentPlan(lessonCode: string) {
    return this.http.get(`${this.apiUrl}/${lessonCode}`);
  }

  updateAssessmentPlan(lessonCode: string, data: any) {
    return this.http.put(`${this.apiUrl}/${lessonCode}`, data);
  }

  // deleteAdditional(lessonCode: string) {
  //     return this.http.delete(`${this.apiUrl}/${lessonCode}`);
  // }
}
