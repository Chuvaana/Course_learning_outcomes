import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { RegLogService } from '../../../../services/regLogService';
import { Image } from 'primeng/image';

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
    RouterModule],
  templateUrl: './register-login.component.html',
  styleUrl: './register-login.component.scss'
})
export class RegisterLoginComponent {

  ingredient!: string;

  isRegister = true;
  teacherForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];

  selectedBranch: string = '';
  filteredDepartments = [];

  constructor(private fb: FormBuilder, private service: RegLogService, private router: Router) {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/)]],
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
      this.branches = data.map(branch => ({ name: branch.name, id: branch.id || branch.name }));
    });
  }

  onBranchChange(branchId: string): void {
    this.service.getDepartments(branchId).subscribe((data: any[]) => {
      if (data) {
        this.departments = data.map(dept => ({ name: dept.name, id: dept.id || dept.name }));
      }
    });
  }

  submitButton(): void {
    console.log(this.isRegister ? "Teacher registering:" : "Teacher logging in:");

    if (this.isRegister) {
      // Registering a teacher
      if (this.teacherForm.valid) {
        this.service.registerTeacher(this.teacherForm.value).subscribe(
          (data: { message: string; teacher: any }) => {
            if (data.message) {
              alert(data.message);
            }
            if (data.teacher) {
              console.log("Teacher created:", data.teacher);
            }
            this.teacherForm.reset(); // Reset form after successful registration
          },
          (error) => {
            let errorMessage = 'Error registering teacher';

            if (error && error.error && error.error.message) {
              errorMessage = error.error.message;
            }

            alert(errorMessage);
            console.error('Error:', error);
          }
        );
      }
    } else {

      this.service.loginTeacher(this.teacherForm.value).subscribe(
        (response: any) => {
          if (response && response.token) {
            console.log("Teacher logged in:", response);

            // Store the token in localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('teacherId', response.teacher.id);

            // Optionally, you can navigate the user to a protected route
            this.router.navigate(['/main/teacher/lessonList']);
          }
        },
        (error) => {
          let errorMessage = 'Error logging in';

          if (error && error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          alert(errorMessage);
          console.error('Error:', error);
        }
      );

    }
  }

  toggleForm() {
    this.isRegister = !this.isRegister;
  }
}
