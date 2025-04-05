import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api'; // ✅ MessageService-г импортлох
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast'; // ✅ Toast-г импортлох
import * as XLSX from 'xlsx';
import { ExamService } from '../../../../services/examService';
import { ActivatedRoute } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { lessonAssessmentService } from '../../../../services/lessonAssessment';

@Component({
  selector: 'app-exam-import',
  standalone: true,
  providers: [MessageService],
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    InputTextModule,
    FileUploadModule
  ],
  templateUrl: './exam-import.component.html',
  styleUrls: ['./exam-import.component.scss'],
})
export class ExamImportComponent {
  assesstmentForm: FormGroup;
  error = 'ERROR';
  questionAmount = 0;
  cloCount: any;
  activeAction = false;
  activeFileLogic = false;
  studentCount: any;
  onlyName: string[] = [];
  onlyId: string[] = [];
  onlyBranch: string[] = [];
  onlyDepartment: string[] = [];
  lessonId!: string;
  tableData: any[][] = [];

  cloQuestion = {
    cloId: null,
    cloName: null,
    max: null,
    min: null
  };
  cloQuestionData: { cloId: any; cloName: any, max: any; min: any }[] = [];

  clos: any[] = []; // Initialize to avoid undefined issues
  formGroup: any;
  constructor(
    private fb: FormBuilder,
    private service: ExamService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private msgService: MessageService,
    // private lessonAssessmentService: lessonAssessmentService
  ) {
    this.assesstmentForm = this.fb.group({
      lessonId: ['', Validators.required],
      studentId: ['', Validators.required],
      allPoint: ['', Validators.required],
      takePoint: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      durationDate: ['', Validators.required],
      question: this.fb.array([{
        questionId: ['', Validators.required],
        cloId: ['', Validators.required],
        allPoint: ['', Validators.required],
        takePoint: ['', Validators.required],
      }
      ]),
    });
  }

  ngOnInit(): void {

    this.route.parent?.paramMap.subscribe(params => {
      this.lessonId = params.get('id')!;
    });

    this.loadBranches();
  }

  loadBranches(): void {
    this.service.getClos().subscribe((data: any[]) => {
      const closData: any[] = [];
      let cloQuestion: any;
      this.cloCount = data.length;
      data.forEach((i) => {
        if (i.lessonId === this.lessonId) {
          closData.push(i);

          const cloQuestion = {
            cloId: i.id,
            cloName: i.cloName,
            max: null,
            min: null
          };

          this.cloQuestionData.push(cloQuestion);
        }
      })
      this.clos = closData;
    });
  }

  onClo(cloId: string): void {
    this.service.getDetails(cloId).subscribe((data: any[]) => {
      console.log(data);
    });
  }
  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      console.error('Cannot use multiple files');
      return;
    }

    const file = target.files[0];

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

      // Зөв файл оруулж байгааг шалгах
      const fileLogic = this.checkData(this.tableData[0]);
      this.activeFileLogic = fileLogic;
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
      'Last name',
      'First name',
      'Username',
      'Email address',
      'Status',
      'Started',
      'Completed',
      'Duration',
      'Grade/10.00',
    ];

    // Trim and normalize for case-insensitive comparison
    const isValid = expectedHeaders.every(
      (header, index) =>
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
      const mismatchedIndex = data.findIndex(
        (header, index) =>
          header?.trim().toLowerCase() !== expectedHeaders[index].toLowerCase()
      );

      this.msgService.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: `Алдаа гарлаа: Дүнгийн файл зөрсөн байна! Алдаа -> '${data[mismatchedIndex]
          }' (${mismatchedIndex + 1}-р багана)`,
      });
      return false;
    }
  }

  checkValue(cloId: any, value: any, type: 'min' | 'max') {
    // min/max утгыг шинэчилж байна
    this.cloQuestionData.forEach(i => {
      if (i.cloId === cloId) {
        if (type === 'min') {
          i.min = Number(value);
        } else {
          i.max = Number(value);
        }
      }
    });

    // 1. MIN > MAX шалгах
    this.cloQuestionData.forEach(i => {
      if (this.isValidRange(i.min, i.max) && i.min >= i.max) {
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: `MIN = '${i.min}' утга MAX = '${i.max}' утгаас их байна.`,
        });
      }
    });

    // 2. Davhtsaj bui range шалгах
    for (let i = 0; i < this.cloQuestionData.length; i++) {
      const a = this.cloQuestionData[i];
      if (!this.isValidRange(a.min, a.max)) continue;

      for (let j = 0; j < this.cloQuestionData.length; j++) {
        const b = this.cloQuestionData[j];
        if (i === j || !this.isValidRange(b.min, b.max)) continue;

        if (this.isOverlap(a.min, a.max, b.min, b.max)) {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: `CLO '${a.cloName}' = [${a.min} - ${a.max}] нь '${b.cloName}' = [${b.min} - ${b.max}] хүрээтэй давхцаж байна.`,
          });
        } else {
          this.activeAction = true;
        }
      }
    }
  }

  // ✅ Range шалгах туслах функц
  private isValidRange(min: any, max: any): boolean {
    return min != null && min !== '' && max != null && max !== '';
  }

  // ✅ Давхцал шалгах функц
  private isOverlap(min1: number, max1: number, min2: number, max2: number): boolean {
    return min1 <= max2 && max1 >= min2;
  }

  save() {
    // Асуулт бүрийн мэдээллийг хадгалах объект
    let questions = {
      questionId: 0,
      cloId: '',
      allPoint: 0,
      takePoint: 0,
    };

    let questionTakePoint: number;
    // Үндсэн assessmentFormDat\
    let assessmentFormDataParam: {
      lessonId: string; studentId: string; allPoint: number; takePoint: string; startDate: string; endDate: string; durationDate: string; question: {
        questionId: number;
        cloId: string;
        allPoint: number;
        takePoint: number;
      }[];
    }[] = [];


    // Логикийг шалгаж эхэлнэ
    if (this.activeFileLogic && this.activeAction) {


      // tableData-д ажиллана
      this.tableData.forEach((e, index) => {
        if (index !== 0) { // Хоёрдугаар мөрөөс эхэлнэ
          const assessmentFormData = {
            lessonId: '',
            studentId: '',
            allPoint: 0,
            takePoint: '',
            startDate: '',
            endDate: '',
            durationDate: '',
            question: [] as {
              questionId: number;
              cloId: string;
              allPoint: number;
              takePoint: number;
            }[],
          };
          assessmentFormData.lessonId = this.lessonId;

          // allPoint-г эхний мөрөөс гаргаж авна
          assessmentFormData.allPoint = Number(this.tableData[0][8].substring(6, 8));
          // Хэрэглэгчийн мэдээлэл
          assessmentFormData.studentId = e[2]; // Оюутны ID (e[2])
          assessmentFormData.takePoint = e[8]; // Оногдсон оноо
          assessmentFormData.startDate = e[5]; // Эхлэх огноо
          assessmentFormData.endDate = e[6]; // Дуусах огноо
          assessmentFormData.durationDate = e[7]; // Тогтоосон хугацаа

          // Шинэчилсэн 'questions' массив
          let questions: {
            questionId: number; // Асуулт ID (row index)
            cloId: any; // CLO ID
            allPoint: number; // Цэгийн оноо
            takePoint: any;
          }[] = []; // Бүх асуултыг хадгалах массив

          // Table-ын 11 болон түүнээс дээш индекстэй элементийн мэдээллийг гаргана
          let countQuetion = 1;
          for (let j = 9; j < e.length; j++) {
            // CLO-ийн шугамд оноо тохирч байгаа эсэхийг шалгах
            this.cloQuestionData.map((data) => {
              if (data.min <= countQuetion && data.max >= countQuetion) {
                const question = {
                  questionId: countQuetion, // Асуулт ID (row index)
                  cloId: data.cloId, // CLO ID
                  allPoint: countQuetion > 9 ? Number(this.tableData[0][j].substring(6, 12)) : Number(this.tableData[0][j].substring(7, 12)), // Цэгийн оноо
                  takePoint: e[j], // Хэрэглэгчийн оноо
                };

                // `questions` массивт асуултыг нэмэх
                questions.push(question);
              }
            });
            countQuetion++;
          }

          // `assessmentFormData` объект руу асуулт нэмэх
          assessmentFormData.question = questions;
          assessmentFormDataParam.push(assessmentFormData);
          // Лог
        }
      });
    }
    console.log(assessmentFormDataParam);

  }

}
