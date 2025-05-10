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
import { AssessmentService } from '../../../../../../services/assessmentService';
import { CloPointPlanService } from '../../../../../../services/cloPointPlanService';
import { TeacherService } from '../../../../../../services/teacherService';
import { PdfCloGeneratorService } from '../../../../../../services/pdf-clo-generator.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PdfMainService } from '../../../../../../services/pdf-main.service';

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
  dataTest = [
    [
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
    ],
    [
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
    ],
    [
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
      'Country',
      'qw',
      'Age',
      'Country',
    ],
  ];
  constructor(
    private fb: FormBuilder,
    private service: TeacherService,
    private cloPointPlanService: CloPointPlanService,
    private assessService: AssessmentService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private pdfMainService: PdfMainService,
    private pdfGeneretorService: PdfCloGeneratorService
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
      this.pdfSendData.push(this.assessPlan);
      this.cloPlan = cloPlan;
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

    // 4. Form group үүсгэх хэсэг
    this.cloPlan.forEach((clo: any) => {
      const procPointsArray = this.fb.array(
        clo.procPoints.map((p: any) =>
          this.fb.group({
            subMethodId: [p.subMethodId],
            point: [p.point],
            cloId: [clo.cloId],
          })
        )
      );

      const examPointsArray = this.fb.array(
        clo.examPoints.map((e: any) =>
          this.fb.group({
            subMethodId: [e.subMethodId],
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
      () =>
        this.msgService.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай хадгалагдлаа',
        }),
      (err) =>
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: `Алдаа гарлаа: ${err.message}`,
        })
    );
    this.readData();
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
    let convertData: any[] = [];
    this.cloPoint.map((e: any, index: any) => {
      let excelData: any = {
        order: index,
        cloName: e.cloName,
      };
      if (e.procPoints.length > 0) {
        let i = 0;
        for (i; i < e.procPoints.length; i++) {
          excelData[`point${i + 1}`] = e.procPoints[i].point;
        }
        for (let j = 1; j <= e.examPoints.length; j++) {
          excelData[`point${j + i}`] = e.examPoints[j - 1].point;
        }
      }
      convertData.push(excelData);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(convertData);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, 'exported-data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + '.xlsx'
    );
  }

  pdfConvert() {
    if (this.cloPoint !== undefined && this.cloPoint !== null) {
      console.log(this.cloPoint);
      console.log(this.pdfSendData);
      this.pdfSendData.push(this.cloPoint);
      this.pdfSendData.push(this.cloPlan);
      this.pdfGeneretorService.generatePdf(this.pdfSendData);
      // this.pdfMainService.generatePdfAll(this.pdfSendData);
    }
  }
}
