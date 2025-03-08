import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppModule } from '../../../app.module';
import { TeacherService } from '../../../services/teacherService';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [AppModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListCompnent {
  fileList: any[] = [];
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
  ngOnInit() {
  }
}
