import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import { AssessmentService } from '../../../../../../services/assessmentService';
import { CloPointPlanService } from '../../../../../../services/cloPointPlanService';
import { PdfCloGeneratorService } from '../../../../../../services/pdf-clo-generator.service';
import { PdfMainService } from '../../../../../../services/pdf-main.service';
import { TeacherService } from '../../../../../../services/teacherService';

interface SubMethod {
  _id: string;
  subMethod: string;
}

interface Plan {
  methodType: string;
  subMethods: SubMethod[];
}

@Component({
  selector: 'app-clo-plan',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    CommonModule,
    TagModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  templateUrl: './clo-point-plan.component.html',
  styleUrl: './clo-point-plan.component.scss',
})
export class CloPointPlanComponent {
  cloForm!: FormGroup;
  cloPoint: any[] = [];

  assessPlan: any;

  cloList!: any;
  cloPlan!: any;
  isUpdate: boolean = false;
  lessonId!: string;
  isLoading = false;

  subMethodOrder: string[] = [];

  pdfSendData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: TeacherService,
    private cloPointPlanService: CloPointPlanService,
    private assessService: AssessmentService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private pdfGeneretorService: PdfCloGeneratorService,
    private pdfMainService: PdfMainService
  ) {}

  async ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    await this.readData();
  }

  async readData() {
    this.isLoading = true;
    this.pdfSendData = [];
    forkJoin([
      this.service.getCloList(this.lessonId),
      this.cloPointPlanService.getPointPlan(this.lessonId),
      this.assessService.getAssessmentByLesson(this.lessonId),
    ]).subscribe(([cloList, cloPlan, assessPlan]) => {
      this.cloList = cloList;
      this.assessPlan = assessPlan;
      this.cloPlan = cloPlan;

      this.cloPlan = this.cloPlan.sort(
        (a: { cloType: string }, b: { cloType: any }) =>
          a.cloType.localeCompare(b.cloType)
      );

      this.cloList = this.cloList.sort(
        (a: { type: string }, b: { type: any }) => a.type.localeCompare(b.type)
      );

      this.subMethodOrder = (assessPlan as any).plans.flatMap((p: any) =>
        p.subMethods.map((s: any) => s._id)
      );
      if (Array.isArray(this.cloPlan) && this.cloPlan.length === 0) {
        this.createRows(this.cloList, this.assessPlan.plans);
      } else {
        this.populateCLOForm();
        this.isUpdate = true;
      }
      this.isLoading = false;
    });
  }

  createRows(cloList: any, cloPlan: any) {
    this.cloPoint = [];

    const cloRows = cloList.map((item: any) => {
      const procPointsArray = this.fb.array<FormGroup>([]);
      const examPointsArray = this.fb.array<FormGroup>([]);

      cloPlan.forEach((plan: any) => {
        plan.subMethods.forEach((sub: any) => {
          const pointGroup = this.fb.group({
            subMethodId: sub._id,
            secondMethodType: plan.secondMethodType || 'ALEC',
            point: [0],
          });

          if (plan.methodType !== 'EXAM') {
            procPointsArray.push(pointGroup);
          } else if (plan.methodType === 'EXAM') {
            examPointsArray.push(pointGroup);
          }
        });
      });

      this.cloPoint.push({
        lessonId: this.lessonId,
        cloId: item.id,
        cloName: item.cloName,
        cloType: item.type,
        procPoints: procPointsArray.value,
        examPoints: examPointsArray.value,
      });

      return this.fb.group({
        cloId: item.id,
        lessonId: this.lessonId,
        cloType: item.type,
        procPoints: procPointsArray,
        examPoints: examPointsArray,
      });
    });

    this.cloForm = this.fb.group({
      cloRows: this.fb.array(cloRows),
    });
  }

  get cloRows(): FormArray {
    return this.cloForm.get('cloRows') as FormArray;
  }

  getPointsControls(cloId: string): FormGroup[] {
    const cloRowsArray = this.cloForm.get('cloRows') as FormArray;

    const cloRow = cloRowsArray.controls.find(
      (row: AbstractControl) => row.get('cloId')?.value === cloId
    ) as FormGroup;

    if (!cloRow) {
      console.warn(`CLO ID ${cloId} not found`);
      return [];
    }

    const pointsArray = cloRow.get('procPoints') as FormArray;

    return this.subMethodOrder
      .map((id) =>
        pointsArray.controls.find(
          (ctrl) => ctrl.get('subMethodId')?.value === id
        )
      )
      .filter((ctrl) => !!ctrl) as FormGroup[];
  }

  getPointsControl(rowIndex: number): FormGroup[] {
    const pointsArray = this.getRowFormGroup(rowIndex).get(
      'procPoints'
    ) as FormArray;
    return pointsArray.controls as FormGroup[];
  }

  getPointsControlsExam(rowIndex: number): FormGroup[] {
    const pointsArray = this.getRowFormGroup(rowIndex).get(
      'examPoints'
    ) as FormArray;
    return pointsArray.controls as FormGroup[];
  }

  isDisabled(row: any, ri: number, pi: number): boolean {
    const secondType =
      this.getPointsControl(ri)[pi].get('secondMethodType')?.value;
    return (
      row.cloType === 'ALEC' &&
      (secondType == 'CLAB' || secondType == 'BSEM') &&
      row.cloType !== secondType
    );
  }

  isMethodType(subMethodId: string, type: string): boolean {
    return this.assessPlan.plans.some((plan: any) => {
      return (
        plan.methodType === type &&
        plan.subMethods.some((s: any) => s._id === subMethodId)
      );
    });
  }

  getRowFormGroup(index: number): FormGroup {
    return this.cloRows.at(index) as FormGroup;
  }

  populateCLOForm() {
    const cloRowsArray = this.fb.array<FormGroup>([]);

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

          clo.procPoints.sort((a: any, b: any) => {
            return (
              this.subMethodOrder.indexOf(a.subMethodId) -
              this.subMethodOrder.indexOf(b.subMethodId)
            );
          });

          clo.examPoints.sort((a: any, b: any) => {
            return (
              this.subMethodOrder.indexOf(a.subMethodId) -
              this.subMethodOrder.indexOf(b.subMethodId)
            );
          });

          if (!inProc && pl.methodType === 'PROC') {
            // insert to original position (optional: keep order)
            const insertIndex = clo.procPoints.findIndex(
              (p: any) =>
                validSubMethodIds.indexOf(sub._id) <
                validSubMethodIds.indexOf(p.subMethodId)
            );
            if (insertIndex === -1) {
              clo.procPoints.push({
                subMethodId: sub._id,
                secondMethodType: pl.secondMethodType || 'ALEC',
                point: 0,
              });
            } else {
              clo.procPoints.splice(insertIndex, 0, {
                subMethodId: sub._id,
                secondMethodType: pl.secondMethodType || 'ALEC',
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
              clo.examPoints.push({
                subMethodId: sub._id,
                secondMethodType: pl.secondMethodType || 'ALEC',
                point: 0,
              });
            } else {
              clo.examPoints.splice(insertIndex, 0, {
                subMethodId: sub._id,
                secondMethodType: pl.secondMethodType || 'ALEC',
                point: 0,
              });
            }
          }
        });
      });
    });

    // 4. Form group үүсгэх хэсэг
    this.cloPlan.forEach((clo: any) => {
      const procPointsArray = this.fb.array(
        clo.procPoints.map((p: any) =>
          this.fb.group({
            subMethodId: [p.subMethodId],
            secondMethodType: [p.secondMethodType],
            point: [p.point],
            cloId: [clo.cloId],
          })
        )
      );

      const examPointsArray = this.fb.array(
        clo.examPoints.map((e: any) =>
          this.fb.group({
            subMethodId: [e.subMethodId],
            secondMethodType: [e.secondMethodType],
            point: [e.point],
            cloId: [clo.cloId],
          })
        )
      );

      cloRowsArray.push(
        this.fb.group({
          lessonId: [clo.lessonId],
          cloId: [clo.cloId],
          cloType: [clo.cloType],
          procPoints: procPointsArray,
          examPoints: examPointsArray,
        })
      );
    });

    this.cloForm = this.fb.group({
      cloRows: cloRowsArray,
    });

    this.cloPoint = this.cloPlan.map((clo: any) => ({
      ...clo,
      cloName:
        this.cloList.find((c: any) => (c.id || c._id) === clo.cloId)?.cloName ??
        '-',
    }));
    const tmp = [];
    tmp.push(
      this.cloPoint.filter((item: any) => {
        return item.cloType === 'ALEC';
      })
    );
    tmp.push(
      this.cloPoint.filter((item: any) => {
        return item.cloType === 'BSEM';
      })
    );
    tmp.push(
      this.cloPoint.filter((item: any) => {
        return item.cloType === 'CLAB';
      })
    );

    this.cloPoint = [...tmp[0], ...tmp[1], ...tmp[2]];
  }

  checkPointsConsistency(): boolean {
    const formData = this.cloForm.value.cloRows;
    let isValid = true;

    this.assessPlan.plans.forEach((pl: any) => {
      pl.subMethods.forEach((sub: any) => {
        let points = 0;
        formData.forEach((row: any) => {
          row.examPoints.forEach((item: any) => {
            if (sub._id === item.subMethodId) {
              points += item.point;
            }
          });
          row.procPoints.forEach((item: any) => {
            if (sub._id === item.subMethodId) {
              points += item.point;
            }
          });
        });

        if (sub.point !== points) {
          this.msgService.add({
            severity: 'warn',
            summary: 'Анхааруулга',
            detail: `${sub.subMethod} баганын нийт оноо (${sub.point}) байх ёстой. Одоогийн нийлбэр оноо (${points})!`,
          });
          isValid = false;
        }
      });
    });

    return isValid;
  }

  onSubmit() {
    const formData = this.cloForm.value.cloRows;

    const isValid = this.checkPointsConsistency();
    if (!isValid) {
      return;
    }
    const request = this.isUpdate
      ? this.cloPointPlanService.updateCloPlan(formData)
      : this.cloPointPlanService.saveCloPlan(formData);
    request.subscribe(
      (res) => {
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай хадгалагдлаа',
        });
        this.readData();
      },
      (err) =>
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: `Алдаа гарлаа: ${err.message}`,
        })
    );
  }

  getCloName(cloId: string): string {
    const clo = this.cloList.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  getTotalProgressScore(rowIndex: number): number {
    return this.getPointsControl(rowIndex)
      .map((ctrl) => ctrl.get('point')?.value || 0)
      .reduce((sum, val) => sum + val, 0);
  }

  getTotalExamScore(rowIndex: number): number {
    return this.getPointsControlsExam(rowIndex)
      .map((ctrl) => ctrl.get('point')?.value || 0)
      .reduce((sum, val) => sum + val, 0);
  }

  getTotalScore(rowIndex: number): number {
    return (
      this.getTotalProgressScore(rowIndex) + this.getTotalExamScore(rowIndex)
    );
  }

  excelConvert(): void {
    const table = document.getElementById('pdf-content') as HTMLTableElement;

    if (!table) {
      console.error('Table not found for Excel export.');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table, {
      raw: true,
    });

    if (worksheet['!ref']) {
      const range = worksheet['!ref'];
      const endColLetter = range.split(':')[1].replace(/[0-9]/g, '');
      const colCount = endColLetter.charCodeAt(0) - 64;
      worksheet['!cols'] = Array(colCount).fill({ wpx: 120 });
    }

    const workbook: XLSX.WorkBook = {
      Sheets: { 'CLO Point Plan': worksheet },
      SheetNames: ['CLO Point Plan'],
    };
    XLSX.writeFile(workbook, 'clo-point-plan.xlsx');
  }

  pdfConvert() {
    if (this.cloPoint !== undefined && this.cloPoint !== null) {
      const assessPlans = this.assessPlan;
      this.pdfSendData.push(assessPlans);
      this.pdfSendData.push(this.cloPoint);
      const cloLength = assessPlans.plans.length - 1;
      if (assessPlans.plans[cloLength].methodType !== 'EXAM') {
        const [row] = assessPlans.plans.splice(cloLength - 1, 1); // Олдсон мөрийг салгаж авна
        assessPlans.plans.push(row);
      }
      this.pdfSendData.push(this.cloPlan);
      this.pdfGeneretorService.generatePdf(this.pdfSendData);
      this.pdfMainService.generatePdfAll(this.pdfSendData);
    }
  }
}
