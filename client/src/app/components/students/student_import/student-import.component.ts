import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppModule } from '../../../app.module';
import { TeacherService } from '../../../services/teacherService';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-student-import',
  standalone: true,
  imports: [AppModule],
  templateUrl: './student-import.component.html',
  styleUrls: ['./student-import.component.scss']
})
export class StudentImpoirtCompnent {
  teacherForm: FormGroup;
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
  tableData: any[][] = [];

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
          const [name, id, userName, password] = e;

          if (name) this.onlyName.push(name);
          if (id) this.onlyId.push(id);
          if (userName) this.onlyUserName.push(userName);
          if (password) this.onlyPassword.push(password);
        });


      console.log(this.onlyName);
      console.log(this.onlyId);
      console.log(this.onlyUserName);
      console.log(this.onlyPassword);
    };

    reader.readAsBinaryString(file);
  }
}
