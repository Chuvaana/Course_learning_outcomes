import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { CurriculumService } from '../../../../../services/curriculum.service';

@Component({
  selector: 'app-lesson-info',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './lesson-info.component.html',
  styleUrl: './lesson-info.component.scss',
})
export class LessonInfoComponent implements OnChanges, OnInit {
  @Input() data: any;
  @Input() studentCount!: number;

  courseDetail: any;
  totalHour: number = 0;
  depName = '';

  lec = 0;
  lab = 0;
  assignment = 0;
  seminar = 0;

  constructor(private service: CurriculumService) {}

  ngOnInit() {
    this.processData(); // handle initial render (in case data is already set)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.processData(); // handle data updates
    }
  }

  private processData() {
    if (this.data && this.data.totalHours) {
      this.totalHour =
        this.data.totalHours.assignment +
        this.data.totalHours.lab +
        this.data.totalHours.lecture +
        this.data.totalHours.practice +
        this.data.totalHours.seminar;

      this.courseDetail = [this.data];
      this.getDepartName(this.data.school, this.data.department);
    }
    if (this.data && this.data.weeklyHours) {
      this.assignment = this.data.weeklyHours.assignment;
      this.lab = this.data.weeklyHours.lab;
      this.lec = this.data.weeklyHours.lecture;
      this.seminar = this.data.weeklyHours.seminar;
    }
  }

  getLessonTypeName(e: any): string {
    if (e === 'REQ') {
      return 'Заавал';
    } else {
      return 'Сонгон';
    }
  }

  getDepartName(e: string, e1: string) {
    this.service.getDepartments(e).subscribe((data: any[]) => {
      if (data) {
        const departments = data
          .filter((dept) => dept.id)
          .map((dept) => ({ name: dept.name, id: dept.id }));

        const selectedDept = departments.find((dept) => dept.id === e1);
        this.depName = selectedDept?.name;
      }
    });
  }

  getSemName(e: any): string {
    if (e === 'autumn') {
      return 'Намар';
    } else if (e === 'spring') {
      return 'Хавар';
    } else if (e === 'any') {
      return 'Дурын';
    } else if (e === 'winter') {
      return 'Өвлийн улирал';
    } else if (e === 'summer') {
      return 'Зуны улирал';
    } else {
      return '';
    }
  }
}
