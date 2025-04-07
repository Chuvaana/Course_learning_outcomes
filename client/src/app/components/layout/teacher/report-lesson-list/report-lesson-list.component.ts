import { Component } from '@angular/core';
import { LessonListComponent } from '../lesson-list/lesson-list.component';

@Component({
  selector: 'app-report-lesson-list',
  imports: [LessonListComponent],
  templateUrl: './report-lesson-list.component.html',
  styleUrl: './report-lesson-list.component.scss',
})
export class ReportLessonListComponent {}
