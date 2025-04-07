import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lesson-assessment',
  imports: [TableModule, ButtonModule, CommonModule, AccordionModule],
  templateUrl: './lesson-assessment.component.html',
  styleUrl: './lesson-assessment.component.scss'
})
export class LessonAssessmentComponent {


  tabs: { title: string; content: any; value: number }[] = [];
  @Input() students!: number;
  @Input() cloList: any;
  @Input() pointPlan: any;
  @Input() cloPlan: any;

  ngOnChanges() {
    if (this.cloList?.length && this.tabs.length === 0) {
      this.tabs = this.cloList.map((item: any, index: number) => ({
        title: item.cloName,
        content: null,
        value: index
      }));
    }
  }

  ngOnInit() {

  }


  headers: string[] = [
    'Цаг төлөвлөлт',
    'Мэдээлэлийг зөв зохион байгуулах',
    'Мэдээлэл шинжилж боловсруулах',
    'Мэдээллийг зөв зохион байгуулах',
    'Мэдээлэл дахин боловсруулалт'
  ];

  // students = [
  //   { studentName: 'м.төгөлдөр', scores: [1, 3, 1, 2, 1] },
  //   { studentName: 'Б.АДЪЯДОРЖ', scores: [0.6, 3, 1, 2, 1] },
  //   { studentName: 'Э.БАГАБАНДИ', scores: [0.8, 3, 1.6, 0.8, 0] },
  //   // Add all the students and their respective scores
  // ];
}
