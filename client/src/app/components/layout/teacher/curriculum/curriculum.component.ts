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
  ],
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

  constructor(
    private route: ActivatedRoute,
    private pdfService: PdfGeneratorService,
    private cloService: CLOService,
    private service: AssessmentService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!; // Get "id" from the parent route
      console.log('Lesson ID:', this.lessonId);
    });
  }
  loadLessonAllData() {
    forkJoin({
      assessment: this.service.getAssessment(this.lessonId),
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
      // assessFooter: this.service.getAssessFooter(this.lessonId),
    }).subscribe((results) => {
      // 🎯 Энд бүх үр дүн хадгалагдсан байна

      this.assessmentData = results.assessment;
      this.additionalData = results.additional;
      this.cloListData = results.cloList;
      this.mainInfoData = results.mainInfo;
      this.materialsData = results.materials;
      this.methodData = results.method;
      this.definitionData = results.definition;
      this.schedulesData = results.schedules;
      this.scheduleSemsData = results.scheduleSems;
      this.scheduleLabsData = results.scheduleLabs;
      this.scheduleBdsData = results.scheduleBds;
      // this.assessFooter = results.assessFooter;

      console.log('Бүх өгөгдөл:', results);
      this.resultData = results;
      this.pdfService.generatePdfTest(this.resultData);
    });
  }

  exportToExcel() {
    this.loadLessonAllData();
  }
}
