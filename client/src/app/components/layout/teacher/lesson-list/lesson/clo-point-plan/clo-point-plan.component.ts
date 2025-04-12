import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver'; // file-saver сан
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { forkJoin, map } from 'rxjs';
import * as XLSX from 'xlsx';
import { CLOService } from '../../../../../../services/cloService';
import { PdfCloGeneratorService } from '../../../../../../services/pdf-clo-generator.service';
import { PdfGeneratorService } from '../../../../../../services/pdf-generator.service';
import { TeacherService } from '../../../../../../services/teacherService';
import { AssessmentService } from '../../../../../../services/assessmentService';
import { CloPointPlanService } from '../../../../../../services/cloPointPlanService';

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
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: TeacherService,
    private cloService: CLOService,
    private cloPointPlanService: CloPointPlanService,
    private assessService: AssessmentService,
    private msgService: MessageService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
      console.log('Lesson ID:', this.lessonId);
    });

    await this.readData();
  }

  async readData() {
    this.isLoading = true;

    await forkJoin([
      this.service.getCloList(this.lessonId),
      this.cloPointPlanService.getPointPlan(this.lessonId),
      this.assessService.getAssessmentByLesson(this.lessonId),
    ]).subscribe(([cloList, cloPlan, assessPlan]) => {
      this.cloList = cloList;
      this.assessPlan = assessPlan;
      this.cloPlan = cloPlan;
      if (Array.isArray(this.cloPlan) && this.cloPlan.length === 0) {
        this.createRows(this.cloList, this.assessPlan.plans);
        this.isLoading = false;
      } else {
        this.populateCLOForm();
        this.isUpdate = true;
        this.isLoading = false;
      }
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

          if (plan.methodType === 'PROC') {
            procPointsArray.push(pointGroup);
          } else if (plan.methodType === 'EXAM') {
            examPointsArray.push(pointGroup);
          }
        });
      });

      this.cloPoint.push({
        lessonId: this.lessonId,
        cloId: item.id,
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

  getPointsControls(rowIndex: number): FormGroup[] {
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

    this.cloPlan.forEach((clo: any) => {
      const procPointsArray = this.fb.array<FormGroup>(
        clo.procPoints.map((p: any) =>
          this.fb.group({
            subMethodId: [p.subMethodId],
            point: [p.point],
          })
        )
      );

      const examPointsArray = this.fb.array<FormGroup>(
        clo.examPoints.map((e: any) =>
          this.fb.group({
            subMethodId: [e.subMethodId],
            point: [e.point],
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

    this.cloPoint = this.cloPlan; // Table-д харуулах
  }
  checkPointsConsistency() {
    const formData = this.cloForm.value.cloRows;
    const j = this.assessPlan;

    this.assessPlan.plans.map((pl: any) => {
      pl.subMethods.map((sub: any) => {
        let points = 0;
        formData.map((row: any) => {
          row.examPoints.map((item: any) => {
            if (sub._id == item.subMethodId) {
              points += item.point;
            }
          });
          row.procPoints.map((item: any) => {
            if (sub._id == item.subMethodId) {
              points += item.point;
            }
          });
        });

        if (sub.point != points) {
          this.msgService.add({
            severity: 'warn',
            summary: 'Анхааруулга',
            detail: `${sub.subMethod} баганын нийт оноо (${sub.point}) байх ёстой. Одоогийн нийлбэр оноо (${points})!`,
          });
          return;
        }
      });
    });
  }

  onSubmit() {
    const formData = this.cloForm.value.cloRows;
    this.checkPointsConsistency();
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
  }

  getCloName(cloId: string): string {
    const clo = this.cloList.find((c: { id: string }) => c.id === cloId);
    return clo ? clo.cloName : 'Unknown';
  }

  getTotalProgressScore(rowIndex: number): number {
    return this.getPointsControls(rowIndex)
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
}
