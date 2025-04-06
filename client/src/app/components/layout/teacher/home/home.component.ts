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

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private service: CurriculumService
  ) {}

  ngOnInit() {
    // Subscribe to the child route's parameter
    this.route.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
      console.log('Lesson ID:', this.lessonId); // This should now print the correct ID
    });
  }

  readMainInfo() {}
  exportToExcel() {}
}
