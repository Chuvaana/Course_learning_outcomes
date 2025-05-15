import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class lessonAssessmentService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  createLesAssessment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lessonAssessments`, data);
  }

  updateLesAssessment(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/lessonAssessments/${id}`, data);
  }

  getLesAssessment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lessonAssessments/${id}`);
  }

  getLesAssessmentByType(id: string, type: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/lessonAssessments/type/${id}?type=${type}`
    );
  }
}
