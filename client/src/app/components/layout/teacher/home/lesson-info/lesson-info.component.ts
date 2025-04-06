import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import { TableModule } from 'primeng/table';

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
      console.log('Processed lesson info:', this.courseDetail);
    }
  }
}
