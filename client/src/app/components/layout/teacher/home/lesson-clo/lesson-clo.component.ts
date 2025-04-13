import { Component, Input, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lesson-clo',
  imports: [TableModule],
  templateUrl: './lesson-clo.component.html',
  styleUrl: './lesson-clo.component.scss',
})
export class LessonCloComponent {
  @Input() data = [];

  clos = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      if (this.data) {
        this.clos = this.data;
      }
    }
  }

  getGroupHeaderLabel(cloType: string): string {
    switch (cloType) {
      case 'Лекц':
        return 'Оюутан лекцийн хичээлийг судалснаар дараах чадваруудыг эзэмшинэ:';
      case 'Семинар':
        return 'Оюутан семинарын хичээлийг судалснаар дараах чадваруудыг эзэмшинэ:';
      case 'Лаборатори':
        return 'Оюутан лабораторийн хичээлийг судалснаар дараах чадваруудыг эзэмшинэ:';
      default:
        return cloType;
    }
  }
}
