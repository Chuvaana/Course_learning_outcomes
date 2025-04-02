import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    getBranches(): Observable<any> {
        return this.http.get(`${this.apiUrl}/branches`);
    }

    // Fetch departments by branch ID
    getDepartments(branchId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/branches/${branchId}/departments`);
    }

    getConfig(): Observable<any> {
        return this.http.get(`${this.apiUrl}/config`);
    }

    submitConfig(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/config`, data);
    }

    updateConfig(data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/config/${data._id}`, data);
    }
}
