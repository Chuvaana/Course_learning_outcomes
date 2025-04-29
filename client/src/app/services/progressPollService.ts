import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressPollService {
  private apiUrl = 'http://localhost:3000/api/pollquestions';
  private apiUrl1 = 'http://localhost:3000/api/studentssendpollques';

  constructor(private http: HttpClient) { }

  addAdditional(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  createPollQuestions(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllPollQuestionss() {
    return this.http.get(`${this.apiUrl}`);
  }

  updatePollQuestions(progressPollId: string, data: any) {
    return this.http.put(`${this.apiUrl}/${progressPollId}`, data);
  }
  getAllPollQuestions(lessonId: string) {
    return this.http.delete(`${this.apiUrl}/${lessonId}`);
  }
  getAllLessonAssments(lessonId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${lessonId}`);
  }


  // buh suragchdiin ugsun unelgeeg harah
  getAllLessonStudentsSendPollQues(lessonId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${lessonId}`);
  }
  //Tuhain suragchiin ugsun unelgeeg harah
  getAllStudentsSendPollQues(lessonId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${lessonId}`);
  }


  // suragch asuult uguh
  createStudentsSendPollQues(data: any) {
    return this.http.post(`${this.apiUrl1}`, data);
  }
  getAllStudentsSendPollQuess() {
    return this.http.get(`${this.apiUrl1}`);
  }
  getStudentsSendPollQuesById(studentId: any) {
    return this.http.get(`${this.apiUrl1}/${studentId}`);
  }
  updateStudentsSendPollQues(data: any) {
    return this.http.post(`${this.apiUrl1}`, data);
  }


}
