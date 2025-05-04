import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private apiUrl = 'http://localhost:3000/api/feedBack';

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
}
