import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private apiUrl = 'http://localhost:3000/api/feedBack';
  private apiUrl1 = 'http://localhost:3000/api/feedBackTask';

  constructor(private http: HttpClient) {}

  addFeedback(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateFeedback(data: any) {
    return this.http.put(`${this.apiUrl}/${data.lessonId}`, data);
  }

  getFeedBack(lessonId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${lessonId}`);
  }

  addFeedbackTask(data: any) {
    return this.http.post(`${this.apiUrl1}`, data);
  }

  updateFeedbackTask(data: any, lessonId: string) {
    return this.http.put(`${this.apiUrl1}/${lessonId}`, data);
  }

  getFeedBackTask(lessonId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}/${lessonId}`);
  }
}
