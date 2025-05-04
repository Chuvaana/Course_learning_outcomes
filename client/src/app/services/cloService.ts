import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CLOService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  createPointPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pointPlans`, data);
  }

  updatePointPlan(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pointPlans/${data.id}`, data);
  }

  getPointPlan(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pointPlans/${id}`);
  }

  getCloList(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clos/${id}`);
  }

  registerClo(cloData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clos`, cloData);
  }

  registerCloList(cloData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clos/all`, cloData);
  }

  updateClo(cloData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clos/${cloData.id}`, cloData);
  }

  deleteClo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clos/${id}`);
  }
}
