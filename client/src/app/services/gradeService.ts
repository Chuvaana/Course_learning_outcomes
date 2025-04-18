import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface GradeRecord {
  _id?: string;
  lessonId: string;
  weekDay: string;
  type: 'lec' | 'sem' | 'lab' | '';
  time: number;
  weekNumber: string;
  labGrade: {
    studentId: string;
    grade1: number;
    grade2: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private apiUrl = 'http://localhost:3000/api/grade'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // ✅ Create labGrade record
  createGrade(labGrade: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, labGrade);
  }

  createGradeAll(labGrade: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/all`, {
      labGradeDatas: labGrade,
    });
  }

  // ✅ Get labGrade records by filters (lessonId, weekNumber, type)
  getGrade(
    lessonId: string,
    weekDay?: string,
    type?: string,
    time?: number
  ): Observable<GradeRecord[]> {
    let queryParams = `?lessonId=${lessonId}`;
    if (weekDay !== undefined) queryParams += `&weekDay=${weekDay}`;
    if (type) queryParams += `&type=${type}`;
    if (time) queryParams += `&time=${time}`;

    return this.http.get<GradeRecord[]>(`${this.apiUrl}${queryParams}`);
  }

  getGradeByLesson(lessonId: string): Observable<GradeRecord[]> {
    return this.http.get<GradeRecord[]>(`${this.apiUrl}/${lessonId}`);
  }

  // ✅ Update an labGrade record
  updateGrade(
    id: string,
    labGrade: Partial<GradeRecord>
  ): Observable<GradeRecord> {
    return this.http.put<GradeRecord>(`${this.apiUrl}/${id}`, labGrade);
  }

  // ✅ Delete an labGrade record
  deleteGrade(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getConfig(itemCode: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/config/${itemCode}`);
  }
}
