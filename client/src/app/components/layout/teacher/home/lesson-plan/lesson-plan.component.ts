import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lesson-plan',
  imports: [CommonModule, TableModule, ProgressSpinnerModule],
  templateUrl: './lesson-plan.component.html',
  styleUrl: './lesson-plan.component.scss',
})
export class LessonPlanComponent implements OnChanges {
  isLoading = false;
  cloPoint: any[] = [];
  sampleData: any;

  @Input() cloList: any;
  @Input() assessPlan: any;
  @Input() cloPlan: any;

  ngOnChanges(changes: SimpleChanges) {
    this.proccessedData();
  }

  proccessedData() {
    this.cloPoint = []; // clear previous rows
    this.sampleData = [];

    if (Array.isArray(this.cloPlan) && this.cloPlan.length === 0) {
      this.createRows();
    } else {
      this.populateCLOForm();
    }

    this.isLoading = false;
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
    const cloRowsArray = [];

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
