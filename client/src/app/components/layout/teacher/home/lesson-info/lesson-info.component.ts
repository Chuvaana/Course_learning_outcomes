import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lesson-info',
  imports: [CommonModule, TableModule],
  templateUrl: './lesson-info.component.html',
  styleUrl: './lesson-info.component.scss',
})
export class LessonInfoComponent {
  courseDetails = [
    {
      name: 'Зургийн боловсруулалт',
      code: 'CS328',
      credits: 3,
      type: 'Мэргэжүүлэх, сонгон',
      teacher: 'Ж.Оргил',
      department: 'Компьютерийн ухааны салбар',
      semester: '3Б',
      studentCount: 18,
      schedule:
        'Задалгаа: (2:0:2:5), Нийт сургалтын цаг: 144 Лекц (32цаг), семинар (16 цаг), лаборатори (16цаг), Бие даан суралцах (80 цаг)',
    },
  ];
}
