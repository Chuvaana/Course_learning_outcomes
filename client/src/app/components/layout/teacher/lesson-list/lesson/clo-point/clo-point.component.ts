import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { CLOService } from '../../../../../../services/cloService';
import { AssessmentService } from '../../../../../../services/assessmentService';

@Component({
  selector: 'app-clo-point',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Required for reactive forms
    InputNumberModule, // PrimeNG number input
    ButtonModule,
    ToastModule,
    FloatLabelModule,
  ],
  providers: [MessageService],
  templateUrl: './clo-point.component.html',
  styleUrls: ['./clo-point.component.scss'],
})
export class CloPointComponent implements OnInit {
  myForm!: FormGroup;
  isNew = true;
  lessonId: string = '';

  assess: any;

  constructor(
    private fb: FormBuilder,
    private msgService: MessageService,
    private cloService: CLOService,
    private service: AssessmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });

    this.myForm = this.fb.group({
      id: [null],
      timeManagement: [0],
      engagement: [0],
      recall: [0],
      problemSolving: [0],
      recall2: [0],
      problemSolving2: [0],
      toExp: [0],
      processing: [0],
      decisionMaking: [0],
      formulation: [0],
      analysis: [0],
      implementation: [0],
      understandingLevel: [0],
      analysisLevel: [0],
      creationLevel: [0],
    });
    this.readData();
  }

  readData() {
    this.cloService.getPointPlan(this.lessonId).subscribe((res) => {
      if (res) {
        const data = res; // Assuming you want the first item
        this.isNew = false;

        this.myForm.patchValue({
          id: data._id, // Include ID
          timeManagement: data.timeManagement,
          engagement: data.engagement,
          recall: data.recall,
          problemSolving: data.problemSolving,
          recall2: data.recall2,
          problemSolving2: data.problemSolving2,
          toExp: data.toExp,
          processing: data.processing,
          decisionMaking: data.decisionMaking,
          formulation: data.formulation,
          analysis: data.analysis,
          implementation: data.implementation,
          understandingLevel: data.understandingLevel,
          analysisLevel: data.analysisLevel,
          creationLevel: data.creationLevel,
        });
      }
    });

    this.service.getAssessFooter(this.lessonId).subscribe((res) => {
      if (res.assessFooter && res.assessFooter.length) {
        res = res[0];
        this.assess = {
          attendanceValue: res.attendanceValue,
          assignmentValue: res.assignmentValue,
          quizValue: res.quizValue,
          projectValue: res.projectValue,
          labValue: res.labValue,
          examValue: res.examValue,
        };
      } else {
        this.msgService.add({
          severity: 'warn',
          summary: 'Анхааруулга',
          detail:
            'Хичээлийн хөтөлбөрийн үнэлгээ хэсгийн үнэлгээний эзлэх хувийг бүртгэнэ үү!',
        });
      }
    });
  }

  validateFinalExamTotal(): boolean {
    const understanding = this.myForm.get('understandingLevel')?.value || 0;
    const analysis = this.myForm.get('analysisLevel')?.value || 0;
    const creation = this.myForm.get('creationLevel')?.value || 0;

    const total = understanding + analysis + creation;

    return total === this.assess.examValue;
  }

  validateParticipation(): boolean {
    const timeManagement = this.myForm.get('timeManagement')?.value || 0;
    const engagement = this.myForm.get('engagement')?.value || 0;

    const total = timeManagement + engagement;

    return total === this.assess.attendanceValue;
  }

  validateMidterm(): boolean {
    const recall = this.myForm.get('recall')?.value || 0;
    const problemSolving = this.myForm.get('problemSolving')?.value || 0;
    const recall2 = this.myForm.get('recall2')?.value || 0;
    const problemSolving2 = this.myForm.get('problemSolving2')?.value || 0;

    const total = recall + recall2 + problemSolving + problemSolving2;

    return total === this.assess.quizValue;
  }

  validateLab(): boolean {
    const toExp = this.myForm.get('toExp')?.value || 0;
    const processing = this.myForm.get('processing')?.value || 0;

    const total = toExp + processing;

    return total === this.assess.labValue;
  }

  validateTask(): boolean {
    const decisionMaking = this.myForm.get('decisionMaking')?.value || 0;
    const formulation = this.myForm.get('formulation')?.value || 0;
    const analysis = this.myForm.get('analysis')?.value || 0;
    const implementation = this.myForm.get('implementation')?.value || 0;

    const total = decisionMaking + formulation + analysis + implementation;

    return total === this.assess.assignmentValue + this.assess.projectValue;
  }

  onSubmit() {
    // Exclude `id` from the sum calculation
    const { id, ...formValues } = this.myForm.value;
    console.log(formValues);
    const sum = Object.values(formValues).reduce(
      (acc, val) => (acc as number) + (val as number),
      0
    );
    if (!this.validateParticipation()) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Хичээлийн идэвх оролцоо нийт оноо ${this.assess.attendanceValue} байх ёстой!`,
      });
      return;
    }
    if (!this.validateMidterm()) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Явцын сорил 1, 2-ийн нийт оноо ${this.assess.quizValue} байх ёстой!`,
      });
      return;
    }
    if (!this.validateLab()) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Лабораторийн нийт оноо ${this.assess.labValue} байх ёстой!`,
      });
      return;
    }
    if (!this.validateTask()) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Даалгаврын нийт оноо ${
          this.assess.assignmentValue + this.assess.projectValue
        } байх ёстой!`,
      });
      return;
    }

    if (!this.validateFinalExamTotal()) {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Улирлын шалгалтын нийт оноо 30 байх ёстой!',
      });
      return; // Датаг илгээхгүй
    }

    if (sum === 100) {
      const formData = { ...this.myForm.value, lessonId: this.lessonId };
      if (this.isNew) {
        // Create new entry (without ID)
        this.cloService.createPointPlan(formData).subscribe((res) => {
          if (res) {
            this.readData();
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай хадгалагдлаа',
            });
          }
        });
      } else {
        // Update existing entry (with ID)
        this.cloService.updatePointPlan(formData).subscribe((res) => {
          this.readData();
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай шинэчлэгдлээ',
          });
        });
      }
    } else {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Нийлбэр оноо 100 байх ёстой. Одоогийн нийлбэр: ${sum}`,
      });
    }
  }
}
