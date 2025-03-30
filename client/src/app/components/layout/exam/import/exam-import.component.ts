import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ExamService } from '../../../../services/examService';

@Component({
  selector: 'app-exam-import',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, PasswordModule, ButtonModule, CommonModule],
  templateUrl: './exam-import.component.html',
  styleUrls: ['./exam-import.component.scss']
})
export class ExamImportComponent {
  studentForm: FormGroup;
  error = 'ERROR';

  constructor(
    private fb: FormBuilder,
    private ExamService: ExamService,
    private dialog: MatDialog
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
      branch: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/)]],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }
}
