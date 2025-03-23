import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { CLOService } from '../../../../../../services/cloService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clo-point',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Required for reactive forms
    InputNumberModule,   // PrimeNG number input
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './clo-point.component.html',
  styleUrls: ['./clo-point.component.scss']
})
export class CloPointComponent implements OnInit {
  myForm!: FormGroup;
  isNew = true;
  lessonId: string = '';

  constructor(
    private fb: FormBuilder,
    private msgService: MessageService,
    private cloService: CLOService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';
    this.myForm = this.fb.group({
      id: [null], // Include ID but don't use it in sum calculation
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
      creationLevel: [0]
    });

    this.cloService.getPointPlan().subscribe((res) => {
      if (res && res.length > 0) {
        const data = res[0]; // Assuming you want the first item
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
          creationLevel: data.creationLevel
        });
      }
    });
  }

  validateFinalExamTotal(): boolean {
    const understanding = this.myForm.get("understandingLevel")?.value || 0;
    const analysis = this.myForm.get("analysisLevel")?.value || 0;
    const creation = this.myForm.get("creationLevel")?.value || 0;

    const total = understanding + analysis + creation;

    return total === 30;
  }

  onSubmit() {
    // Exclude `id` from the sum calculation
    const { id, ...formValues } = this.myForm.value;
    console.log(formValues)
    const sum = Object.values(formValues).reduce((acc, val) => (acc as number) + (val as number), 0);

    if (!this.validateFinalExamTotal()) {
      this.msgService.add({
        severity: "warn",
        summary: "Анхааруулга",
        detail: "Улирлын шалгалтын нийт оноо 30 байх ёстой!",
      });
      return; // Датаг илгээхгүй
    }

    if (sum === 100) {
      const formData = { ...this.myForm.value };
      if (this.isNew) {
        // Create new entry (without ID)
        this.cloService.createPointPlan(formData).subscribe(res => {
          this.msgService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Амжилттай хадгалагдлаа',
          });
        });
      } else {
        // Update existing entry (with ID)
        this.cloService.updatePointPlan(formData).subscribe(res => {
          this.msgService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Амжилттай шинэчлэгдлээ',
          });
        });
      }
    } else {
      this.msgService.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: `Нийлбэр оноо 100 байх ёстой. Одоогийн нийлбэр: ${sum}`
      });
    }
  }
}
