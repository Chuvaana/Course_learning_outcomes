import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { RegLogService } from '../../../../services/regLogService';
import { Image } from 'primeng/image';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MatDialog } from '@angular/material/dialog';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@Component({
  selector: 'app-register-login',
  standalone: true,
  imports: [
    Image,
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    CardModule,
    RouterModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './register-login.component.html',
  styleUrl: './register-login.component.scss',
})
export class RegisterLoginComponent {
  ingredient!: string;

  isRegister = false;
  teacherForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];

  selectedBranch: string = '';
  filteredDepartments = [];

  constructor(
    private fb: FormBuilder,
    private service: RegLogService,
    private dialog: MatDialog,
    private router: Router,
    private msgService: MessageService
  ) {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/),
        ],
      ],
      branch: ['', Validators.required],
      department: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.service.getBranches().subscribe((data: any[]) => {
      this.branches = data.map((branch) => ({
        name: branch.name,
        id: branch.id || branch.name,
      }));
    });
  }

  onBranchChange(branchId: string): void {
    this.service.getDepartments(branchId).subscribe((data: any[]) => {
      if (data) {
        this.departments = data.map((dept) => ({
          name: dept.name,
          id: dept.id || dept.name,
        }));
      }
    });
  }

  submitButton(): void {
    if (this.isRegister) {
      if (this.teacherForm.valid) {
        this.service.registerTeacher(this.teacherForm.value).subscribe(
          (data: { message: string; teacher: any }) => {
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай бүртгэгдлээ',
            });
            this.isRegister = false;
            this.teacherForm.reset();
          },
          (error) => {
            let errorMessage = 'Error registering teacher';

            if (error && error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: `Алдаа гарлаа: ${errorMessage}`,
            });
          }
        );
      }
    } else {
      this.service.loginTeacher(this.teacherForm.value).subscribe(
        (response: any) => {
          if (response && response.token) {
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай нэвтэрлээ',
            });
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('teacherId', response.teacher.id);

            this.router.navigate(['/main/teacher/lessonList']);
          }
        },
        (error) => {
          let errorMessage = 'Error logging in';

          if (error && error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: `Алдаа гарлаа: ${errorMessage}`,
          });
        }
      );
    }
  }

  toggleForm() {
    this.isRegister = !this.isRegister;
  }
  resetPass() {
    let transData = null;
    if (this.teacherForm.value.email) {
      transData = this.teacherForm.value.email;
    }
    this.dialog.open(PasswordResetComponent, {
      width: '40vw',
      height: '40vh',
      maxWidth: 'none',
      data: { email: transData },
    });
  }
}
