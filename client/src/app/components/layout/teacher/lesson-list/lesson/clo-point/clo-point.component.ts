import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-clo-point',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Required for reactive forms
    InputNumberModule,   // PrimeNG number input
    ButtonModule],
  templateUrl: './clo-point.component.html',
  styleUrl: './clo-point.component.scss'
})
export class CloPointComponent implements OnInit {
  cloForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cloForm = this.fb.group({
      timeManagement: [5, [Validators.required, Validators.min(0)]],
      engagement: [3, [Validators.required, Validators.min(0)]],
      recall: [5, [Validators.required, Validators.min(0)]],
      problemSolving: [10, [Validators.required, Validators.min(0)]],
      recall2: [5, [Validators.required, Validators.min(0)]],
      problemSolving2: [10, [Validators.required, Validators.min(0)]],
      toExp: [2, [Validators.required, Validators.min(0)]],
      processing: [5, [Validators.required, Validators.min(0)]], // Fixed typo from 'procceing'
      decisionMaking: [6, [Validators.required, Validators.min(0)]],
      formulation: [7, [Validators.required, Validators.min(0)]],
      analysis: [100, [Validators.required, Validators.min(0)]],
      implementation: [2, [Validators.required, Validators.min(0)]],
      understandingLevel: [2, [Validators.required, Validators.min(0)]],
      analysisLevel: [2, [Validators.required, Validators.min(0)]],
      creationLevel: [3, [Validators.required, Validators.min(0)]],
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  onSubmit() {
    if (this.cloForm.valid) {
      console.log('Form Data:', this.cloForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
