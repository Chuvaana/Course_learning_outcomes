import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import { AssessmentService } from '../../../../../services/assessmentService';
import { CloPointPlanService } from '../../../../../services/cloPointPlanService';
import { TeacherService } from '../../../../../services/teacherService';
interface Assessment {
  id: string;
  lessonId: string;
  clo: any;
  attendance: boolean;
  assignment: boolean;
  quiz: boolean;
  project: boolean;
  lab: boolean;
  exam: boolean;
}

interface AssessFooter {
  id?: string;
  lessonId: string;
  name: string;
  attendanceValue: number;
  assignmentValue: number;
  quizValue: number;
  projectValue: number;
  labValue: number;
  examValue: number;
}

@Component({
  selector: 'app-assessment-method',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ToastModule,
    TagModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
  ],
  providers: [MessageService],
  templateUrl: './assessment-method.component.html',
  styleUrl: './assessment-method.component.scss',
})
export class AssessmentMethodComponent {
  isLoading = false;
  cloPoint: any[] = [];
  sampleData: any;
  cloList: any;
  assessPlan: any;
  cloPlan: any;

  @Input() lessonId: any;

  constructor(
    private teacherService: TeacherService,
    private assessService: AssessmentService,
    private cloPointPlanService: CloPointPlanService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.proccessedData();
  }

  proccessedData() {
    forkJoin([
      this.teacherService.getCloList(this.lessonId),
      this.cloPointPlanService.getPointPlan(this.lessonId),
      this.assessService.getAssessmentByLesson(this.lessonId),
    ]).subscribe(([cloList, cloPlan, assessPlan]) => {
      this.cloList = cloList;
      this.assessPlan = assessPlan;
      this.cloPlan = cloPlan;
      this.cloPoint = []; // clear previous rows
      this.sampleData = [];

      if (Array.isArray(this.cloPlan) && this.cloPlan.length === 0) {
        this.createRows();
      } else {
        this.populateCLOForm();
      }
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

  populateCLOForm() {
    // const cloRowsArray = [];

    // 1. Gather all valid subMethodIds from assessPlan
    const validSubMethodIds = this.assessPlan.plans
      .flatMap((pl: any) => pl.subMethods)
      .map((sub: any) => sub._id);

    // 2. Update cloPlan: remove subMethodId entries that are no longer valid
    this.cloPlan.forEach((clo: any) => {
      clo.procPoints = clo.procPoints.filter((p: any) =>
        validSubMethodIds.includes(p.subMethodId)
      );

      clo.examPoints = clo.examPoints.filter((e: any) =>
        validSubMethodIds.includes(e.subMethodId)
      );
    });

    // 3. Then proceed with syncing new subMethods like before
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
            // insert to original position (optional: keep order)
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

  getTotalProgressScore(rowIndex: number): number {
    const row = this.cloPoint[rowIndex];
    return row.procPoints
      .map((p: any) => Number(p.point) || 0)
      .reduce((sum: number, val: number) => sum + val, 0);
  }

  getTotalExamScore(rowIndex: number): number {
    const row = this.cloPoint[rowIndex];
    return row.examPoints
      .map((e: any) => Number(e.point) || 0)
      .reduce((sum: number, val: number) => sum + val, 0);
  }

  getTotalScore(rowIndex: number): number {
    return (
      this.getTotalProgressScore(rowIndex) + this.getTotalExamScore(rowIndex)
    );
  }

  getCloName(cloId: string): string {
    const clo = this.cloList.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  getGroupHeaderLabel(cloType: string): string {
    switch (cloType) {
      case 'ALEC':
        return 'Лекцийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'BSEM':
        return 'Семинарын хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      case 'CLAB':
        return 'Лабораторийн хичээлээр эзэмшсэн суралцахуйн үр дүнгүүд';
      default:
        return cloType;
    }
  }
}
