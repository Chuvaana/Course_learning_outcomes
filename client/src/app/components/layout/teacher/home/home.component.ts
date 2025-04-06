import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { LessonInfoComponent } from './lesson-info/lesson-info.component';
import { LessonCloComponent } from './lesson-clo/lesson-clo.component';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
import { LessonAssessmentComponent } from './lesson-assessment/lesson-assessment.component';
import { LessonOverallAssessComponent } from './lesson-overall-assess/lesson-overall-assess.component';
import { LessonIndirectAssessComponent } from './lesson-indirect-assess/lesson-indirect-assess.component';
import { LessonDirectIndirectComponent } from './lesson-direct-indirect/lesson-direct-indirect.component';
import { LessonPollAnalysisComponent } from './lesson-poll-analysis/lesson-poll-analysis.component';
import { TeacherService } from '../../../../services/teacherService';
import { CurriculumService } from '../../../../services/curriculum.service';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../../services/studentService';
import { CLOService } from '../../../../services/cloService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    ButtonModule,
    LessonInfoComponent,
    LessonCloComponent,
    LessonPlanComponent,
    LessonAssessmentComponent,
    LessonOverallAssessComponent,
    LessonIndirectAssessComponent,
    LessonDirectIndirectComponent,
    LessonPollAnalysisComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  lessonId!: string;
  teacherId!: string;
  mainInfo = [];
  studentCount!: number;
  clos = [];

  types = [
    { label: 'Лекц семинар', value: 'LEC_SEM' },
    { label: 'Лаборатори', value: 'LAB' },
  ];

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private service: CurriculumService,
    private cloService: CLOService
  ) {}

  ngOnInit() {
    // Subscribe to the child route's parameter
    this.route.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
      console.log('Lesson ID:', this.lessonId); // This should now print the correct ID
    });
    this.teacherId = (localStorage.getItem('teacherId') as string) || '';
    this.readMainInfo();
    this.readClos();
  }

  readMainInfo() {
    this.service.getMainInfo(this.lessonId).subscribe((response: any) => {
      if (response) {
        this.mainInfo = response;
      }
    });

    this.studentService.getStudents(this.lessonId).subscribe((res) => {
      this.studentCount = res.length;
    });
  }

  readClos() {
    this.cloService.getCloList(this.lessonId).subscribe((data: any) => {
      this.clos = data.map((item: any) => {
        const typeLabel = this.types.find(
          (type) => type.value === item.type
        )?.label;

        return {
          id: item.id,
          type: typeLabel,
          cloName: item.cloName,
          knowledge: item.knowledge || false,
          skill: item.skill || false,
          attitude: item.attitude || false,
        };
      });

      console.log(this.clos);
    });
  }
  exportToExcel() {}
}
