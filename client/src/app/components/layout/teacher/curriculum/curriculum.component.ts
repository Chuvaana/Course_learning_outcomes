import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { forkJoin } from 'rxjs';
import { AssessmentService } from '../../../../services/assessmentService';
import { CLOService } from '../../../../services/cloService';
import { PdfGeneratorService } from '../../../../services/pdf-generator.service';
import { AdditionalComponent } from './additional/additional.component';
import { AssessmentMethodComponent } from './assessment-method/assessment-method.component';
import { CloComponent } from './clo/clo.component';
import { MainInfoComponent } from './main-info/main-info.component';
import { MaterialsComponent } from './materials/materials.component';
import { MethodologyComponent } from './methodology/methodology.component';
import { OtherComponent } from './other/other.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CloPointPlanService } from '../../../../services/cloPointPlanService';

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    MainInfoComponent,
    OtherComponent,
    MaterialsComponent,
    CloComponent,
    ScheduleComponent,
    AssessmentMethodComponent,
    AdditionalComponent,
    MethodologyComponent,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss',
})
export class CurriculumComponent {
  lessonId!: string;
  body: any;
  resultData: any;

  assessmentData: any;
  additionalData: any;
  cloListData: any;
  mainInfoData: any;
  materialsData: any;
  methodData: any;
  definitionData: any;
  schedulesData: any;
  scheduleSemsData: any;
  scheduleLabsData: any;
  scheduleBdsData: any;
  cloPlanData: any;
  assessFooter: any;
  pointPlan: any;

  constructor(
    private route: ActivatedRoute,
    private pdfService: PdfGeneratorService,
    private cloService: CLOService,
    private messageService: MessageService,
    private service: AssessmentService,
    private assessService: AssessmentService,
    private cloPointPlanService: CloPointPlanService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!; // Get "id" from the parent route
      console.log('Lesson ID:', this.lessonId);
    });
  }
  loadLessonAllData() {
    forkJoin({
      // assessment: this.service.getAssessment(this.lessonId),
      additional: this.service.getAdditional(this.lessonId),
      cloList: this.service.getCloList(this.lessonId),
      mainInfo: this.service.getMainInfo(this.lessonId),
      materials: this.service.getMaterials(this.lessonId),
      method: this.service.getMethod(this.lessonId),
      definition: this.service.getDefinition(this.lessonId),
      schedules: this.service.getSchedules(this.lessonId),
      scheduleSems: this.service.getScheduleSems(this.lessonId),
      scheduleLabs: this.service.getScheduleLabs(this.lessonId),
      scheduleBds: this.service.getScheduleBds(this.lessonId),
      pointPlan: this.cloPointPlanService.getPointPlan(this.lessonId),
      assessmentByLesson: this.assessService.getAssessmentByLesson(this.lessonId),
    }).subscribe(
      (results) => {
        console.log('Бүх өгөгдөл:', results);
        this.resultData = results;
        this.pdfService.generatePdfTest(this.resultData);
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail:
            'Тайлан хэвлэхэд алдаа гарлаа бүтэн мэдээлэл оруулна уу!: ' +
            err.message,
        });
      }
    );
  }

  exportToExcel() {
    this.loadLessonAllData();
  }
}
