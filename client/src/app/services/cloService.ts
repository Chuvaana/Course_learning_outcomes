import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CLOService {

  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  createPointPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pointPlans`, data);
  }

  updatePointPlan(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pointPlans/${data.id}`, data);
  }

  saveCloPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cloPlans`, data);
  }
  
  updateCloPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cloPlans/edit`, data);
  }

  getPointPlan(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pointPlans`);
  }

  getCloPlan(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cloPlans`);
  }
}