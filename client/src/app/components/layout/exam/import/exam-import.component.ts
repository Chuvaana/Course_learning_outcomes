import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import * as XLSX from 'xlsx';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ExamService } from '../../../../services/examService';
import { MessageService } from 'primeng/api';  // ✅ MessageService-г импортлох
import { ToastModule } from 'primeng/toast';   // ✅ Toast-г импортлох

@Component({
  selector: 'app-exam-import',
  standalone: true,
  providers: [MessageService],
  imports: [ReactiveFormsModule, DropdownModule, PasswordModule, ButtonModule, ToastModule, CommonModule],
  templateUrl: './exam-import.component.html',
  styleUrls: ['./exam-import.component.scss']
})
export class ExamImportComponent {
  studentForm: FormGroup;
  error = 'ERROR';
  questionAmount = 0;
  cloCount: any;
  studentCount: any;
  onlyName: string[] = [];
  onlyId: string[] = [];
  onlyBranch: string[] = [];
  onlyDepartment: string[] = [];
  tableData: any[][] = [];
  clos: any[] = []; // Initialize to avoid undefined issues
  constructor(
    private fb: FormBuilder,
    private service: ExamService,
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
    this.loadBranches();
  }

  loadBranches(): void {
    this.service.getClos().subscribe((data: any[]) => {
      this.cloCount = data.length;
      this.clos = data;
    });
  }

  onClo(cloId: string): void {
    this.service.getDetails(cloId).subscribe((data: any[]) => {
      console.log(data);
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

      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      this.tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.studentCount = this.tableData.length - 1;

      // Зөв файл оруулж байгааг шалгах
      const fileLogic = this.checkData(this.tableData[0]);
      if (!fileLogic) {
        this.tableData = [];
      } else {

        this.countQuestion(this.tableData[0]);


        this.tableData
          .filter((e: string[]) => e.length >= 9)
          .forEach((e: string[]) => {
            const [name, id, branch, department] = e;
            if (name) this.onlyName.push(name);
            if (id) this.onlyId.push(id);
            if (branch) this.onlyBranch.push(branch);
            if (department) this.onlyDepartment.push(department);
          });

      }
    };

    reader.readAsBinaryString(file);
  }
  countQuestion(data: any[]) {
    let count = 0;
    data.map((i) => {
      if (i.substring(0, 2) === 'Q.') {
        count++;
      }
    });
    this.questionAmount = count;
  }

  checkData(data: any[]): boolean {
    const expectedHeaders = [
      'Last name', 'First name', 'Username', 'Email address', 'Status',
      'Started', 'Completed', 'Duration', 'Grade/10.00'
    ];

    // Trim and normalize for case-insensitive comparison
    const isValid = expectedHeaders.every((header, index) =>
      data[index]?.trim().toLowerCase() === header.toLowerCase()
    );

    if (isValid) {
      this.msgService.add({
        severity: 'success',
        summary: 'Амжилттай',
        detail: 'Зөв сурагчдын дүнгийн файл оруулсан байна.',
      });
      return true;
    } else {
      // Identify the first mismatch for better debugging
      const mismatchedIndex = data.findIndex((header, index) =>
        header?.trim().toLowerCase() !== expectedHeaders[index].toLowerCase()
      );

      this.msgService.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: `Алдаа гарлаа: Дүнгийн файл зөрсөн байна! Алдаа -> '${data[mismatchedIndex]}' (${mismatchedIndex + 1}-р багана)`,
      });
      return false;
    }
  }

}
