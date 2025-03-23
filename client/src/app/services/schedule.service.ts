import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  addSchedules(data: any) {
    return this.http.post(`${this.apiUrl}/schedules`, data);
  }

  getSchedules(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/schedules/${lessonCode}`);
  }

  updateSchedules(lessonCode: string, data: any) {
    return this.http.put(`${this.apiUrl}/schedules/${lessonCode}`, data);
  }

  deleteSchedules(lessonCode: string) {
    return this.http.delete(`${this.apiUrl}/schedules/${lessonCode}`);
  }

  addScheduleSems(data: any) {
    return this.http.post(`${this.apiUrl}/scheduleSems`, data);
  }

  getScheduleSems(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/scheduleSems/${lessonCode}`);
  }

  updateScheduleSems(lessonCode: string, data: any) {
    return this.http.put(`${this.apiUrl}/scheduleSems/${lessonCode}`, data);
  }

  deleteScheduleSems(lessonCode: string) {
    return this.http.delete(`${this.apiUrl}/scheduleSems/${lessonCode}`);
  }


  addScheduleLabs(data: any) {
    return this.http.post(`${this.apiUrl}/scheduleLabs`, data);
  }

  getScheduleLabs(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/scheduleLabs/${lessonCode}`);
  }

  updateScheduleLabs(lessonCode: string, data: any) {
    return this.http.put(`${this.apiUrl}/scheduleLabs/${lessonCode}`, data);
  }

  deleteScheduleLabs(lessonCode: string) {
    return this.http.delete(`${this.apiUrl}/scheduleLabs/${lessonCode}`);
  }

  addScheduleBds(data: any) {
    return this.http.post(`${this.apiUrl}/scheduleBds`, data);
  }

  getScheduleBds(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/scheduleBds/${lessonCode}`);
  }

  updateScheduleBds(lessonCode: string, data: any) {
    return this.http.put(`${this.apiUrl}/scheduleBds/${lessonCode}`, data);
  }

  deleteScheduleBds(lessonCode: string) {
    return this.http.delete(`${this.apiUrl}/scheduleBds/${lessonCode}`);
  }


  getCloList(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clos/${id}`);
  }
}
