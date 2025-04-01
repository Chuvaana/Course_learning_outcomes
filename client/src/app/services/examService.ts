import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  // Fetch all branches
  getBranches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches`);
  }
  // Fetch all branches
  getClos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clos`);
  }
  // Fetch departments by branch ID
  getDetails(cloId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clos/${cloId}`);
  }
  // Fetch departments by branch ID
  registerExam(branchId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches/${branchId}/departments`);
  }
}
