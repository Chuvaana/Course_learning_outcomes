import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import * as XLSX from 'xlsx';
import { StudentService } from '../../../../services/studentService';
import { TeacherComponent } from '../../teacher/teacher.component';

@Component({
  selector: 'app-student-import',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, PasswordModule, ButtonModule, CommonModule, FormsModule],
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
  studentCount : any;
  selectedBranch: string = '';
  filteredDepartments = [];
  onlyName: string[] = []; // Define the type explicitly
  onlyId: string[] = [];
  onlyBranch: string[] = [];
  onlyDepartment: string[] = [];
  tableData: any[][] = [];


  constructor(
    private fb: FormBuilder,
    private service: StudentService,
    private dialog: MatDialog
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
      branch: ['', Validators.required],
      department: ['', Validators.required]
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

      this.studentCount = this.tableData.length - 1;
      this.tableData
        .filter((e: string[]) => e.length >= 4) // Ensure at least 4 elements are present
        .forEach((e: string[]) => {
          const [name, id, branch, department] = e;

          if (name) this.onlyName.push(name);
          if (id) this.onlyId.push(id);
          if (branch) this.onlyBranch.push(branch);
          if (department) this.onlyDepartment.push(department);
        });
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
      // if (this.studentForm.valid) {
      this.service.registerStudent(this.studentForm.value).subscribe(
        (data: { message: string; student: any }) => {
          if (data.message) {
            alert(data.message);
          }
          if (data.student) {
            console.log(" created:", data.student);
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
