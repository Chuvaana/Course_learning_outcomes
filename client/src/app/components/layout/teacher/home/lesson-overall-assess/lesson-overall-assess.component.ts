import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lesson-overall-assess',
  imports: [TableModule, ButtonModule, CommonModule],
  templateUrl: './lesson-overall-assess.component.html',
  styleUrl: './lesson-overall-assess.component.scss',
})
export class LessonOverallAssessComponent {
  content: any;
}
