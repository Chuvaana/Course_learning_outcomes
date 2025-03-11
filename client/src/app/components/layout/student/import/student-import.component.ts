import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { AppModule } from '../../../../app.module';
import { TeacherService } from '../../../../services/teacherService';
import { TeacherComponent } from '../../teacher/teacher.component';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../../services/studentService';

@Component({
  selector: 'app-student-import',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, PasswordModule, ButtonModule, CommonModule],
  templateUrl: './student-import.component.html',
  styleUrls: ['./student-import.component.scss']
})
export class StudentImportComponent {
  studentForm: FormGroup;
  branches: any[] = [];
  departments: any[] = [];

  error = 'ERROR';
  active = true;
  firstType = true;
  selectedBranch: string = '';
  filteredDepartments = [];
  onlyName: string[] = []; // Define the type explicitly
  onlyId: string[] = [];
  onlyUserName: string[] = [];
  onlyPassword: string[] = [];
  onlyEmail: string[] = [];
  onlyBranch: string[] = [];
  tableData: any[][] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
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

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      console.error('Cannot use multiple files');
      return;
    }

    const file = target.files[0];

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryString: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

      // Get the first sheet
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON array of arrays
      this.tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log(this.tableData); // Output data to console

      this.tableData
        .filter((e: string[]) => e.length >= 4) // Ensure at least 4 elements are present
        .forEach((e: string[]) => {
          const [name, id, userName, password, email, branch] = e;

          if (name) this.onlyName.push(name);
          if (id) this.onlyId.push(id);
          if (userName) this.onlyUserName.push(userName);
          if (password) this.onlyPassword.push(password);
          if (email) this.onlyEmail.push(email);
          if (branch) this.onlyBranch.push(branch);
        });


      console.log(this.onlyName);
      console.log(this.onlyId);
      console.log(this.onlyUserName);
      console.log(this.onlyPassword);
    };

    reader.readAsBinaryString(file);
  }

  openPopup() {
    this.dialog.open(TeacherComponent, {
      width: '800px',
      height: '600px'
    });
  }

  submit() {
    for (let i = 1; i <= this.onlyName.length; i++) {
      this.studentForm.value.name = this.onlyName[i];
      this.studentForm.value.id = this.onlyId[i];
      this.studentForm.value.userName = this.onlyName[i];
      this.studentForm.value.email = this.onlyEmail[i];
      this.studentForm.value.branch = this.onlyBranch[i];
      this.studentForm.value.password = this.onlyPassword[i];
      // if (this.studentForm.valid) {
      this.studentService.registerStudent(this.studentForm.value).subscribe(
        (data: { message: string; student: any }) => {
          if (data.message) {
            alert(data.message);
          }
          if (data.student) {
            console.log("Teacher created:", data.student);
          }
        },
        (error) => {
          // Handle error response
          let errorMessage = 'Error registering teacher';

          if (error && error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          alert(errorMessage);
          console.error('Error:', error);
        }
      );
      // }
    }
  }
}
