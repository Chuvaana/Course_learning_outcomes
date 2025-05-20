import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { forkJoin } from 'rxjs';
import { AssessmentService } from '../../../../services/assessmentService';
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
  cloPoint: any;
  cloList: any;
  cloPlan: any;

  constructor(
    private route: ActivatedRoute,
    private pdfService: PdfGeneratorService,
    private service: AssessmentService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
  }

  loadLessonAllData() {
    forkJoin({
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
    }).subscribe((results : any) => {
      // 🎯 Энд бүх үр дүн хадгалагдсан байна
      this.createRows();
      this.additionalData = results.additional;
      this.cloList = results.cloList;
      results.cloPoint = this.cloPoint;
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

  createRows() {
    this.cloPoint = [];

    this.cloList.map((item: any) => {
      const procPointsArray: any[] = [];
      const examPointsArray: any[] = [];

      this.cloPlan.forEach((plan: any) => {
        plan.subMethods.forEach((sub: any) => {
          const pointGroup = {
            subMethodId: sub._id,
            point: [0],
          };

          if (plan.methodType === 'PROC') {
            procPointsArray.push(pointGroup);
          } else if (plan.methodType === 'EXAM') {
            examPointsArray.push(pointGroup);
          }
        });
      });

      this.cloPoint.push({
        lessonId: '',
        cloId: item.id,
        cloType: item.type,
        procPoints: procPointsArray,
        examPoints: examPointsArray,
      });
    });
  }
}
