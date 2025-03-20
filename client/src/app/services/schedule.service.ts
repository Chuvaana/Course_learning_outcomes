import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:3000/api/schedules';

  constructor(private http: HttpClient) {}

  addSchedules(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getSchedules(lessonCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${lessonCode}`);
  }

  updateSchedules(lessonCode: string, data: any) {
    return this.http.put(`${this.apiUrl}/${lessonCode}`, data);
  }

  deleteSchedules(lessonCode: string) {
    return this.http.delete(`${this.apiUrl}/${lessonCode}`);
  }
}
