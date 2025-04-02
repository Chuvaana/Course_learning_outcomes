import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private apiUrl = 'http://localhost:3000/api'; // Update with your backend URL

    constructor(private http: HttpClient) { }

    getConfig(itemCode: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/config/${itemCode}`);
    }
}
