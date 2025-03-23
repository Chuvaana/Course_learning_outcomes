import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MethodService {

    private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

    constructor(private http: HttpClient) { }

    createMethod(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/methodologys`, data);
    }

    updateMethod(data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/methodologys/${data.id}`, data);
    }

    getMethod(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/methodologys/${id}`);
    }

    getCloList(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/clos/${id}`);
    }
}