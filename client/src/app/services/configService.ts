import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private apiUrl = 'http://localhost:3000/api/config';

  constructor(private http: HttpClient) {}

  getConfig(itemCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${itemCode}`);
  }
}
