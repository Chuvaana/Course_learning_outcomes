import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MainInfoResponse {
  lessonName: string;
  lessonCode: string;
  lessonCredit: number;
  school: string;
  department: string;
  prerequisite: string;
  lessonLevel: string;
  lessonType: string;
  recommendedSemester: string;
  assistantTeacher?: {
    name: string;
    email: string;
    phone: number;
    room: string;
  };
  teacher?: {
    name: string;
    email: string;
    phone: number;
    room: string;
  };
  weeklyHours?: {
    lecture: number;
    seminar: number;
    lab: number;
    assignment: number;
    practice: number;
  };
  totalHours?: {
    lecture: number;
    seminar: number;
    lab: number;
    assignment: number;
    practice: number;
  };
  selfStudyHours?: {
    lecture: number;
    seminar: number;
    lab: number;
    assignment: number;
    practice: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  getBranches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches`);
  }

  getDepartments(branchId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches/${branchId}/departments`);
  }

  registerLessonMainInfo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teachers`, data);
  }

  saveLesson(data: any) {
    return this.http.post(`${this.apiUrl}/lesson`, data);
  }

  getLessons() {
    return this.http.get(`${this.apiUrl}/lesson`);
  }

  updateLesson(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/lesson/${id}`, data);
  }

  deleteLesson(id: string) {
    return this.http.delete(`${this.apiUrl}/lesson/${id}`);
  }

  getMainInfo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesson/${id}`);
  }

  addLessonToTeacher(id: string, teacherData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/teachers/addLesson/${id}`,
      teacherData
    );
  }

  getCurriculumByLessonId(id: string) {
    return this.http.get(`${this.apiUrl}/lessonCurriculum/${id}`);
  }

  createLessonCurriculum(data: any) {
    return this.http.post(`${this.apiUrl}/lessonCurriculum`, data);
  }

  updateLessonCurriculum(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/lessonCurriculum/${id}`, data);
  }

  getAllLessonCurriculums() {
    return this.http.get(`${this.apiUrl}/lessonCurriculum`);
  }


  getCloList(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clos/${id}`);
  }

  getPollQuesLesson(lessonId: string) {
    return this.http.get(`${this.apiUrl}/studentsSendPollQues/lesson/${lessonId}`);
  }

  getLessonByStudent(lessonId: string) {
    return this.http.get(`${this.apiUrl}/lesStudents/${lessonId}`);
  }
}
