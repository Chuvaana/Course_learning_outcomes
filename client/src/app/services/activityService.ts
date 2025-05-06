import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Activity {
  _id?: string;
  lessonId: string;
  weekDay: string;
  type: 'alec' | 'bsem' | 'clab' | '';
  time: number;
  weekNumber: string;
  activity: { studentId: string; point: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl = 'http://localhost:3000/api/activity'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // ✅ Create activity record
  createActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}`, activity);
  }

  createActivityAll(activity: Activity[]): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/all`, {
      activityDatas: activity,
    });
  }

  // ✅ Get activity records by filters (lessonId, weekNumber, type)
  getActivity(
    lessonId: string,
    weekDay?: string,
    type?: string,
    time?: number
  ): Observable<Activity[]> {
    let queryParams = `?lessonId=${lessonId}`;
    if (weekDay !== undefined) queryParams += `&weekDay=${weekDay}`;
    if (type) queryParams += `&type=${type}`;
    if (time) queryParams += `&time=${time}`;

    return this.http.get<Activity[]>(`${this.apiUrl}${queryParams}`);
  }

  getActivityByLesson(lessonId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/${lessonId}`);
  }

  // ✅ Update an activity record
  updateActivity(
    id: string,
    activity: Partial<Activity>
  ): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, activity);
  }

  // ✅ Delete an activity record
  deleteActivity(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getConfig(itemCode: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/config/${itemCode}`);
  }
}
