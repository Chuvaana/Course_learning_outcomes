import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { forkJoin } from 'rxjs';
import { CLOService } from '../../../../services/cloService';
import { CurriculumService } from '../../../../services/curriculum.service';
import { StudentService } from '../../../../services/studentService';
import { TeacherService } from '../../../../services/teacherService';
import { LessonAssessmentComponent } from './lesson-assessment/lesson-assessment.component';
import { LessonCloComponent } from './lesson-clo/lesson-clo.component';
import { LessonDirectIndirectComponent } from './lesson-direct-indirect/lesson-direct-indirect.component';
import { LessonIndirectAssessComponent } from './lesson-indirect-assess/lesson-indirect-assess.component';
import { LessonInfoComponent } from './lesson-info/lesson-info.component';
import { LessonOverallAssessComponent } from './lesson-overall-assess/lesson-overall-assess.component';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
import { LessonPollAnalysisComponent } from './lesson-poll-analysis/lesson-poll-analysis.component';

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

  // үндсэн мэдээлэл
  mainInfo = [];
  studentCount!: number;

  // суралцахуйн үр дүн
  clos = [];

  // төлөвлөгөө
  cloList = [];
  pointPlan = [];
  cloPlan = [];

  // clo дүн
  tabDatas!: [{ title: string, content: any, value: any }];
  students!: any;

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
    this.route.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.teacherId = (localStorage.getItem('teacherId') as string) || '';
    this.readMainInfo();
    this.readClos();
    this.readPlan();
  }

  readMainInfo() {
    this.service.getMainInfo(this.lessonId).subscribe((response: any) => {
      if (response) {
        this.mainInfo = response;
      }
    });

    this.studentService.getStudents(this.lessonId).subscribe((res) => {
      this.students = res;
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
    });
  }

  readPlan() {
    forkJoin([
      this.teacherService.getCloList(this.lessonId),
      this.cloService.getPointPlan(this.lessonId),
      this.cloService.getCloPlan(this.lessonId),
    ]).subscribe(([cloList, pointPlan, cloPlan]) => {
      this.cloList = cloList;
      this.pointPlan = pointPlan || {
        timeManagement: 0,
        engagement: 0,
        recall: 0,
        problemSolving: 0,
        recall2: 0,
        problemSolving2: 0,
        toExp: 0,
        processing: 0,
        decisionMaking: 0,
        formulation: 0,
        analysis: 0,
        implementation: 0,
        understandingLevel: 0,
        analysisLevel: 0,
        creationLevel: 0,
      };

      this.cloPlan = cloPlan;
      // if ((Array.isArray(this.cloPlan[0]) && this.cloPlan[0].length === 0)) {
      //   this.cloPlan[0] = [this.pointPlan];
      // }s
      // if (Array.isArray(this.cloPlan) && this.cloPlan.length === 0) {
      //   this.createRows();
      //   this.isLoading = false;
      // } else {
      //   this.populateCLOForm();
      //   this.isUpdate = true;
      //   this.isLoading = false;
      // }
    });
  }

  exportToExcel() {}
}
