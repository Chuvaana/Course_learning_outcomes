import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FinalExamService {
  private apiUrl = 'http://localhost:3000/api/finalExam';
  private apiUrl1 = 'http://localhost:3000/api';
  private apiUrlVerb = 'http://localhost:3000/api/verb';

  constructor(private http: HttpClient) {}

  addDataFinal(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }
  editDataFinal(id: any, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getDataFinalExams() {
    return this.http.get(`${this.apiUrl}`);
  }

  getLessonDataFinalExams(id: any, type: string) {
    return this.http.get(`${this.apiUrl}/${id}?type=${type}`);
  }

  addFinalExam(data: any) {
    return this.http.post(`${this.apiUrl1}/finalExamQuestion`, data);
  }

  getFinalExams() {
    return this.http.get(`${this.apiUrl1}/finalExamQuestion`);
  }

  getAllFinalExamQuestions(lessonId: string, type: string) {
    return this.http.get(
      `${this.apiUrl1}/finalExamQuestion/${lessonId}?type=${type}`
    );
  }

  updateFinalExam(lessonId: string, data: any) {
    return this.http.put(`${this.apiUrl1}/finalExamQuestion/${lessonId}`, data);
  }

  deleteFinalExam(id: any, finalExamId: string) {
    return this.http.delete(
      `${this.apiUrl1}/finalExamQuestion/${finalExamId}/${id}`
    );
  }

  getVerb() {
    return this.http.get(`${this.apiUrlVerb}`);
  }

  getDetailVerb(id: any) {
    return this.http.get(`${this.apiUrlVerb}/${id}`);
  }

  getCloList(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl1}/clos/${id}`);
  }

  getMainInfo(id: string) {
    return this.http.get(`${this.apiUrl1}/lesson/${id}`);
  }
}
