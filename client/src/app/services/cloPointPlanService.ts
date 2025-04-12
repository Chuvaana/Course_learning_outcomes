import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloPointPlanService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  saveCloPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clo-plans`, data);
  }

  updateCloPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clo-plans/edit`, data);
  }

  getPointPlan(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clo-plans/${id}`);
  }
}
