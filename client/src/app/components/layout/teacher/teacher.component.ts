import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { TeacherService } from '../../../services/teacherService';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, PasswordModule, ButtonModule, CommonModule],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss'
})
export class TeacherComponent {

  isRegister = true;
  teacherForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];

  selectedBranch: string = '';
  filteredDepartments = [];

  constructor(private fb: FormBuilder, private teacherService: TeacherService) {
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

  // Load branches from backend
  loadBranches(): void {
    this.teacherService.getBranches().subscribe((data: any[]) => {
      this.branches = data.map(branch => ({ name: branch.name, id: branch.id || branch.name })); 
    });
  }

  // Load departments when branch is selected
  onBranchChange(branchId: string): void {
    this.teacherService.getDepartments(branchId).subscribe((data: any[]) => {
      if(data){
        this.departments = data.map(dept => ({ name: dept.name, id: dept.id || dept.name })); 
      }
    });
  }

  // Register teacher
  registerTeacher(): void {
    console.log(this.teacherForm.valid);
    if (this.teacherForm.valid) {
      this.teacherService.registerTeacher(this.teacherForm.value).subscribe((response: String) => {
        alert('Teacher registered successfully!');
        this.teacherForm.reset();
      }, (error: String) => {
        alert('Error registering teacher');
      });
    }
  }

  toggleForm() {
    this.isRegister = !this.isRegister;
  }
}
