import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AssessmentService {

    private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

    constructor(private http: HttpClient) { }

    createAssessment(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/assessments`, data);
    }

    updateAssessment(id: string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/assessments/${id}`, data);
    }

    getAssessment(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/assessments/${id}`);
    }

    getCloList(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/clos/${id}`);
    }
}