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
  cloPoint: any;
  cloList: any;
  cloPlan: any;
  assessPlan: any;

  constructor(
    private route: ActivatedRoute,
    private pdfService: PdfGeneratorService,
    private cloService: CLOService,
    private messageService: MessageService,
    private service: AssessmentService,
    private assessService: AssessmentService,
    private cloPointPlanService: CloPointPlanService
  ) { }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
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
      assessmentByLesson: this.assessService.getAssessmentByLesson(
        this.lessonId
      ),
    }).subscribe(
      (results: any) => {
        this.cloList = results.cloList;
        this.cloPlan = results.pointPlan;
        this.assessPlan = results.assessmentByLesson;
        if (Array.isArray(this.cloPlan) && this.cloPlan.length === 0) {
          this.createRows();
        } else {
          this.populateCLOForm();
        }
        results.cloPoint = this.cloPoint;
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

  populateCLOForm() {
    const validSubMethodIds = this.assessPlan.plans
      .flatMap((pl: any) => pl.subMethods)
      .map((sub: any) => sub._id);

    this.cloPlan.forEach((clo: any) => {
      clo.procPoints = clo.procPoints.filter((p: any) =>
        validSubMethodIds.includes(p.subMethodId)
      );

      clo.examPoints = clo.examPoints.filter((e: any) =>
        validSubMethodIds.includes(e.subMethodId)
      );
    });

    this.assessPlan.plans.forEach((pl: any) => {
      pl.subMethods.forEach((sub: any) => {
        this.cloPlan.forEach((clo: any) => {
          pl.methodPoint = pl.subMethods.reduce(
            (sum: number, sub: any) => sum + (sub.point || 0),
            0
          );
          const inProc = clo.procPoints.some(
            (p: any) => p.subMethodId === sub._id
          );
          const inExam = clo.examPoints.some(
            (e: any) => e.subMethodId === sub._id
          );

          if (!inProc && pl.methodType === 'PROC') {
            const insertIndex = clo.procPoints.findIndex(
              (p: any) =>
                validSubMethodIds.indexOf(sub._id) <
                validSubMethodIds.indexOf(p.subMethodId)
            );
            if (insertIndex === -1) {
              clo.procPoints.push({ subMethodId: sub._id, point: 0 });
            } else {
              clo.procPoints.splice(insertIndex, 0, {
                subMethodId: sub._id,
                point: 0,
              });
            }
          }

          if (!inExam && pl.methodType === 'EXAM') {
            const insertIndex = clo.examPoints.findIndex(
              (e: any) =>
                validSubMethodIds.indexOf(sub._id) <
                validSubMethodIds.indexOf(e.subMethodId)
            );
            if (insertIndex === -1) {
              clo.examPoints.push({ subMethodId: sub._id, point: 0 });
            } else {
              clo.examPoints.splice(insertIndex, 0, {
                subMethodId: sub._id,
                point: 0,
              });
            }
          }
        });
      });
    });

    this.cloPoint = this.cloPlan;
  }

  exportToExcel() {
    this.loadLessonAllData();
  }
}
