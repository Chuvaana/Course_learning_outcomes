import { Injectable } from '@angular/core';
import { CurriculumService } from '../../../services/curriculum.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDictService {
  types = [
    { label: 'Лекц', value: 'ALEC' },
    { label: 'Семинар', value: 'BSEM' },
    { label: 'Лаборатори', value: 'CLAB' },
  ];

  constructor(private service: CurriculumService) {}

  getDictionary(lessonId: string, lower: boolean): Observable<any[]> {
    return this.service.getMainInfo(lessonId).pipe(
      map((response: any) => {
        const weeklyLecture = response.weeklyHours.lecture;
        const weeklySeminar = response.weeklyHours.seminar;
        const weeklyLab = response.weeklyHours.lab;

        let filteredTypes = [...this.types];

        if (!weeklyLecture || weeklyLecture === 0) {
          filteredTypes = filteredTypes.filter((t) => t.value !== 'ALEC');
        }
        if (!weeklySeminar || weeklySeminar === 0) {
          filteredTypes = filteredTypes.filter((t) => t.value !== 'BSEM');
        }
        if (!weeklyLab || weeklyLab === 0) {
          filteredTypes = filteredTypes.filter((t) => t.value !== 'CLAB');
        }

        if (lower) {
          filteredTypes = filteredTypes.map((type) => ({
            ...type,
            value: type.value.toLowerCase(),
          }));
        }

        return filteredTypes;
      })
    );
  }
}
