import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://localhost:3000/api/materials';

  constructor(private http: HttpClient) {}

  addMaterials(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getMaterials(lessonCode: string) {
    console.log(lessonCode + "fff");
    return this.http.get(`${this.apiUrl}/${lessonCode}`);
  }

  updateMaterials(lessonCode: string, data: any) {
    return this.http.put(`${this.apiUrl}/${lessonCode}`, data);
  }

  deleteMaterials(lessonCode: string) {
    return this.http.delete(`${this.apiUrl}/${lessonCode}`);
  }
}
