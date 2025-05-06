import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attendance {
  _id?: string;
  lessonId: string;
  weekDay: string;
  type: 'alec' | 'bsem' | 'clab' | '';
  time: number;
  weekNumber: string;
  attendance: { studentId: string; status: boolean }[];
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = 'http://localhost:3000/api/attendance'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // ✅ Create attendance record
  createAttendance(attendance: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}`, attendance);
  }

  createAttendanceAll(attendance: Attendance[]): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/all`, {
      attendanceDatas: attendance,
    });
  }

  // ✅ Get attendance records by filters (lessonId, weekNumber, type)
  getAttendance(
    lessonId: string,
    weekDay?: string,
    type?: string,
    time?: number
  ): Observable<Attendance[]> {
    let queryParams = `?lessonId=${lessonId}`;
    if (weekDay !== undefined) queryParams += `&weekDay=${weekDay}`;
    if (type) queryParams += `&type=${type}`;
    if (time) queryParams += `&time=${time}`;

    return this.http.get<Attendance[]>(`${this.apiUrl}${queryParams}`);
  }
  // ✅ Get attendance records by filters (lessonId, weekNumber, type)
  getStudentAttendance(lessonId: string): Observable<Attendance[]> {
    const studentCode = localStorage.getItem('studentCode');
    let queryParams = `?studentCode=${studentCode}`;

    return this.http.get<Attendance[]>(
      `${this.apiUrl}/student/${lessonId}${queryParams}`
    );
  }

  getAttendanceByLesson(lessonId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/${lessonId}`);
  }

  // ✅ Update an attendance record
  updateAttendance(
    id: string,
    attendance: Partial<Attendance>
  ): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/${id}`, attendance);
  }

  // ✅ Delete an attendance record
  deleteAttendance(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getConfig(itemCode: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/config/${itemCode}`);
  }
}
