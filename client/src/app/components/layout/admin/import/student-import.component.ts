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
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-student-import',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, PasswordModule, ButtonModule, CommonModule, FileUploadModule, ToastModule],
  providers: [MessageService],
  templateUrl: './student-import.component.html',
  styleUrls: ['./student-import.component.scss']
})
export class AdminStudentImportComponent {
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
  onlyStudentName: string[] = [];
  onlyPassword: string[] = [];
  onlyEmail: string[] = [];
  onlyBranch: string[] = [];
  studentAllData: string[] = [];
  tableData: any[][] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private dialog: MatDialog,
    private msgService: MessageService
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
    this.onlyName = []; // Define the type explicitly
    this.onlyId = [];
    this.onlyStudentName = [];
    this.onlyPassword = [];
    this.onlyEmail = [];
    this.onlyBranch = [];
    const file = event.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryString: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, {
        type: 'binary',
      });

      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      this.tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // console.log(this.tableData);
      this.checkData(this.tableData);
    };

    reader.readAsBinaryString(file);
  }

  checkData(data: any) {
    data.map((e: any, index: any) => {
      if (index > 0) {
        this.onlyName.push(e[1]);
        this.onlyId.push(e[0]);
        this.onlyStudentName.push(e[1].substring(2, 6));
        this.onlyPassword.push(e[0].substring(6, 10));
        this.onlyEmail.push(e[0] + '@must.edu.mn');
        this.onlyBranch.push('6801bb108e66a6fc4ee4b1e9');
      }
    })
    console.log(this.onlyName);
    console.log(this.onlyId);
    console.log(this.onlyStudentName);
    console.log(this.onlyPassword);
    console.log(this.onlyEmail);
    console.log(this.onlyBranch);
  }

  openPopup() {
    this.dialog.open(TeacherComponent, {
      width: '800px',
      height: '600px'
    });
  }

  submit() {
    for (let i = 0; i < this.onlyName.length; i++) {
      const studentData = {
        name: this.onlyName[i],
        id: this.onlyId[i],
        userName: this.onlyName[i],
        email: this.onlyEmail[i],
        password: this.onlyPassword[i],
        branch: this.onlyBranch[i]
      };

      this.studentService.getStudentId(studentData.id).subscribe(
        (res) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: `Оюутан (${studentData.name}) бүртгэлтэй байна.`,
          });
        },
        (error) => {
          const errorMsg = error?.error?.message || '';

          if (
            (error.status === 404 && errorMsg === "Student not found") ||
            (error.status === 400 && errorMsg === "Student ID is required")
          ) {
            this.registerData(studentData);
          } else {
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: `Оюутан (${studentData.name}) бүртгэхэд алдаа гарлаа.`,
            });
          }
        }
      );
    }
  }

  registerData(e : any) {
    this.studentService.registerStudent(e).subscribe(
      (data: { message: string; student: any }) => {
        if (data.message) {
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
        console.error('Error:', error);
      }
    );
  }
}
