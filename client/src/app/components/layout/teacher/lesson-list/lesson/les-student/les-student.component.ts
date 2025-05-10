import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import * as XLSX from 'xlsx';
import { StudentService } from '../../../../../../services/studentService';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SharedDictService } from '../../../shared';

interface Student {
  lessonId: string;
  studentCode: string;
  studentName: string;
  lecDay?: string;
  lecTime?: string;
  semDay?: string;
  semTime?: string;
  labDay?: string;
  labTime?: string;
}

@Component({
  selector: 'app-les-student',
  standalone: true,
  providers: [MessageService],
  imports: [
    ReactiveFormsModule,
    ToastModule,
    DropdownModule,
    PasswordModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    FileUploadModule,
  ],
  templateUrl: './les-student.component.html',
  styleUrl: './les-student.component.scss',
})
export class LesStudentComponent {
  studentForm: FormGroup;

  error = 'ERROR';
  active = true;
  studentCount: any;
  onlyName: string[] = [];
  onlyId: string[] = [];
  tableData: any[][] = [];

  lessonTypes: any[] = [];

  weeks = [
    { id: 'Monday', name: 'Даваа' },
    { id: 'Tuesday', name: 'Мягмар' },
    { id: 'Wednesday', name: 'Лхагва' },
    { id: 'Thursday', name: 'Пүрэв' },
    { id: 'Friday', name: 'Баасан' },
  ];

  times = [
    { id: '1', name: '1-р цаг' },
    { id: '2', name: '2-р цаг' },
    { id: '3', name: '3-р цаг' },
    { id: '4', name: '4-р цаг' },
    { id: '5', name: '5-р цаг' },
    { id: '6', name: '6-р цаг' },
    { id: '7', name: '7-р цаг' },
    { id: '8', name: '8-р цаг' },
  ];

  studentList: Student[] = [];
  lessonId!: string;

  constructor(
    private fb: FormBuilder,
    private service: StudentService,
    private route: ActivatedRoute,
    private msgService: MessageService,
    private shared: SharedDictService
  ) {
    this.studentForm = this.fb.group({
      week: ['', Validators.required],
      time: ['', Validators.required],
      lessonType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.shared.getDictionary(this.lessonId, false).subscribe((res) => {
      this.lessonTypes = res;
    });
  }

  onFileChange(event: any) {
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

      this.studentCount = this.tableData.length - 1;

      this.tableData.forEach((e: string[]) => {
        const [id, name] = e;
        if (name) this.onlyName.push(name);
        if (id) this.onlyId.push(id);
      });
    };

    reader.readAsBinaryString(file);
  }

  submit() {
    const day = this.studentForm.get('week')?.value;
    const time = this.studentForm.get('time')?.value;
    for (let i = 1; i <= this.onlyName.length - 1; i++) {
      this.studentList.push({
        lessonId: this.lessonId,
        studentCode: this.onlyId[i],
        studentName: this.onlyName[i],
        lecDay: this.studentForm.get('lessonType')?.value == 'ALEC' ? day : '',
        lecTime:
          this.studentForm.get('lessonType')?.value == 'ALEC' ? time : '',
        labDay: this.studentForm.get('lessonType')?.value == 'CLAB' ? day : '',
        labTime:
          this.studentForm.get('lessonType')?.value == 'CLAB' ? time : '',
        semDay: this.studentForm.get('lessonType')?.value == 'BSEM' ? day : '',
        semTime:
          this.studentForm.get('lessonType')?.value == 'BSEM' ? time : '',
      });
    }

    if (this.studentForm.valid && this.studentList.length > 0) {
      this.service.registerLesStudent(this.studentList).subscribe(
        (data) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгалагдлаа!',
          });
        },
        (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        }
      );
    }

    this.studentList = [];
  }
}
