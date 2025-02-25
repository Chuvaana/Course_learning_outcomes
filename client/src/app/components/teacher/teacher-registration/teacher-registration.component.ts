import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppModule } from '../../../app.module';
import { TeacherService } from '../../../services/teacherService';

@Component({
  selector: 'app-teacher-registration',
  standalone: true,
  imports: [AppModule],
  templateUrl: './teacher-registration.component.html',
  styleUrls: ['./teacher-registration.component.scss']
})
export class TeacherRegistrationComponent {
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
      department: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.loadBranches();
  }

  // Load branches from backend
  loadBranches(): void {
    this.teacherService.getBranches().subscribe((data: any[]) => {
      this.branches = data.map(branch => ({ name: branch.name, id: branch.id || branch.name })); // Ensure it has an ID
    });
  }

  // Load departments when branch is selected
  onBranchChange(branchId: string): void {
    this.teacherService.getDepartments(branchId).subscribe((data: any[]) => {
      this.departments = data.map(dept => ({ name: dept.name, id: dept.id || dept.name })); // Ensure ID exists
    });
  }

  // Register teacher
  registerTeacher(): void {
    if (this.teacherForm.valid) {
      this.teacherService.registerTeacher(this.teacherForm.value).subscribe((response: String) => {
        alert('Teacher registered successfully!');
        this.teacherForm.reset();
      }, (error: String) => {
        alert('Error registering teacher');
      });
    }
  }
}
