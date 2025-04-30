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
import { InputTextModule } from 'primeng/inputtext';
import { Image } from 'primeng/image';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'login-student',
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
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './login-student.component.html',
  providers: [MessageService],
  styleUrl: './login-student.component.scss',
})
export class LoginStudentComponent {
  ingredient!: string;

  isRegister = false;
  studentForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];

  selectedBranch: string = '';
  filteredDepartments = [];

  constructor(
    private fb: FormBuilder,
    private service: RegLogService,
    private router: Router,
    private msgService: MessageService
  ) {
    this.studentForm = this.fb.group({
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
    console.log(
      this.isRegister ? 'Student registering:' : 'Student logging in:'
    );

    if (this.isRegister) {
      // Registering a Student
      if (this.studentForm.valid) {
        this.service.registerStudent(this.studentForm.value).subscribe(
          (data: { message: string; Student: any }) => {
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: 'Амжилттай бүртгэгдлээ',
            });
            if (data.message) {
              alert(data.message);
            }
            if (data.Student) {
              console.log('Student created:', data.Student);
            }
            this.studentForm.reset(); // Reset form after successful registration
          },
          (error) => {
            let errorMessage = 'Error registering student';

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
      this.service.loginStudent(this.studentForm.value).subscribe(
        (response: any) => {
          if (response && response.token) {
            this.msgService.add({
              severity: 'success',
              summary: 'Амжилттай',
              detail: `Оюутан (${response.student.email}) амжилттай нэвтэрлээ.`,
            });

            // Store the token in localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('studentCode', response.student.code);
            localStorage.setItem('studentId', response.student.id);

            // Optionally, you can navigate the user to a protected route
            this.router.navigate(['/main/student/lesson-list']);
          }
        },
        (error) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: `Нэвтрэхэд алдаа гарлаа. ${error}`,
          });
        }
      );
    }
  }

  toggleForm() {
    this.isRegister = !this.isRegister;
  }
}
