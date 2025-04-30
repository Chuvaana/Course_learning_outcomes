import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinalExamService {
  private apiUrl = 'http://localhost:3000/api/finalExam';

  constructor(private http: HttpClient) {}

  addFinalExam(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getFinalExams() {
    return this.http.get(`${this.apiUrl}`);
  }

  updateFinalExam(lessonId: string, data: any) {
    return this.http.put(`${this.apiUrl}/${lessonId}`, data);
  }
}
