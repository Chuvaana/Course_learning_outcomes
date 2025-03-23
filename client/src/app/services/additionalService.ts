import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AdditionalService {
    private apiUrl = 'http://localhost:3000/api/additionals';

    constructor(private http: HttpClient) { }

    addAdditional(data: any) {
        return this.http.post(`${this.apiUrl}`, data);
    }

    getAdditional(lessonCode: string) {
        return this.http.get(`${this.apiUrl}/${lessonCode}`);
    }

    updateAdditional(lessonCode: string, data: any) {
        return this.http.put(`${this.apiUrl}/${lessonCode}`, data);
    }

    deleteAdditional(lessonCode: string) {
        return this.http.delete(`${this.apiUrl}/${lessonCode}`);
    }
}
