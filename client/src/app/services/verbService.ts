import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerbService {
  private apiUrl = 'http://localhost:3000/api/verb';

  constructor(private http: HttpClient) {}

  addVerb(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getVerbs() {
    return this.http.get(`${this.apiUrl}`);
  }

  deleteVerbs(id : any){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateVerb(lessonId: string, data: any) {
    return this.http.put(`${this.apiUrl}/${lessonId}`, data);
  }
}
