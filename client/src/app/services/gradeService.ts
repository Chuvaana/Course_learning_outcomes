import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private apiUrl = 'http://localhost:3000/api/grade'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  createGrade(labGrade: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, labGrade);
  }

  createGradeAll(labGrade: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/all`, {
      labGradeDatas: labGrade,
    });
  }

  getGrade(
    lessonId: string,
    weekDay?: string,
    type?: string,
    time?: number
  ): Observable<any[]> {
    let queryParams = `?lessonId=${lessonId}`;
    if (weekDay !== undefined) queryParams += `&weekDay=${weekDay}`;
    if (type) queryParams += `&type=${type}`;
    if (time) queryParams += `&time=${time}`;

    return this.http.get<any[]>(`${this.apiUrl}${queryParams}`);
  }

  getGradeByLesson(lessonId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${lessonId}`);
  }

  updateGrade(id: string, labGrade: Partial<any>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, labGrade);
  }

  deleteGrade(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getConfig(itemCode: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/config/${itemCode}`);
  }
}
