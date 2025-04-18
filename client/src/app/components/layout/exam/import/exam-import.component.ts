import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-exam-import',
  standalone: true,
  providers: [MessageService],
  imports: [
    Checkbox,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    InputTextModule,
    FileUploadModule,
    InputNumberModule,
    TableModule,
    FloatLabelModule,
  ],
  templateUrl: './exam-import.component.html',
  styleUrls: ['./exam-import.component.scss'],
})
export class ExamImportComponent {
  assesstmentForm: FormGroup;
  error = 'ERROR';
  questionAmount = 0;
  cloCount: any;
  activeAction = true;
  activeFileLogic = false;
  checkCloCount = false;
  studentCount: any;
  onlyName: string[] = [];
  onlyId: string[] = [];
  onlyBranch: string[] = [];
  onlyDepartment: string[] = [];
  lessonId!: string;
  tableData: any[][] = [];
  missingNumberCount: any;
  checked: boolean = false;
  lessonAllStudents: any;

  cities: City[] | undefined;

  examTypeAction = false;
  examType: any = null;
  examTypeData: any = null;

  @ViewChild('minV') minV!: ElementRef;
  @ViewChild('maxV') maxV!: ElementRef;
  cloQuestion = {
    cloId: null,
    cloName: null,
    max: null,
    min: null,
  };
  cloQuestionData: { cloId: any; cloName: any; max: any; min: any }[] = [];


  examTypes = [
    { label: 'Сорил 1', value: 'exam1' },
    { label: 'Сорил 2', value: 'exam2' },
    { label: 'Улирлын шалгалт', value: 'finalExam' },
  ];


  clos: any[] = []; // Initialize to avoid undefined issues
  formGroup: any;
  constructor(
    private fb: FormBuilder,
    private service: ExamService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private msgService: MessageService,
    private lessonAssessmentService: lessonAssessmentService
  ) {
    this.assesstmentForm = this.fb.group({
      lessonId: ['', Validators.required],
      studentId: ['', Validators.required],
      allPoint: ['', Validators.required],
      takePoint: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      durationDate: ['', Validators.required],
      question: this.fb.array([
        {
          questionId: ['', Validators.required],
          cloId: ['', Validators.required],
          allPoint: ['', Validators.required],
          takePoint: ['', Validators.required],
        },
      ]),
    });
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
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
            min: null,
          };

          this.cloQuestionData.push(cloQuestion);
        }
      });
      this.clos = closData;
    });
  }

  onClo(cloId: string): void {
    this.service.getDetails(cloId).subscribe((data: any[]) => {
      console.log(data);
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

  resetInputs() {
    this.clos.forEach((clo) => {
      clo.minValue = null;
      clo.maxValue = null;
    });
  }

  checkValue(cloId: any, value: any, type: 'min' | 'max') {
    // 3. Орхигдсон утгууд шалгах

    if (this.questionAmount > 0) {
      // if (this.questionAmount >= value && type === 'max') {
      const allSelectedNumbers: Set<number> = new Set();

      // min/max утгыг шинэчилж байна
      this.cloQuestionData.forEach((i) => {
        if (i.cloId === cloId) {
          if (type === 'max') {
            if (value == '') {
              i.max = 0;
            } else {
              i.max = Number(value);
            }
          } else {
            if (value == '') {
              i.min = 0;
            } else {
              i.min = Number(value);
            }
          }
        }

        if (this.isValidRange(i.min, i.max)) {
          for (let n = i.min; n <= i.max; n++) {
            allSelectedNumbers.add(n);
          }
          console.log(allSelectedNumbers);
        }
      });

      const missingNumbers: number[] = [];
      for (let i = 1; i <= this.questionAmount; i++) {
        if (!allSelectedNumbers.has(i)) {
          missingNumbers.push(i);
        }
      }

      if (missingNumbers.length > 0) {
        this.checkCloCount = false;
        // this.msgService.add({
        //   severity: 'warn',
        //   summary: 'Анхааруулга',
        //   detail: `Дараах тоонууд хамрагдаагүй байна: ${missingNumbers.join(
        //     ', '
        //   )}`,
        // });
        this.missingNumberCount = missingNumbers;
      } else {
        this.checkCloCount = true;
        // this.msgService.add({
        //   severity: 'success',
        //   summary: 'Амжилттай',
        //   detail: 'Бүх асуултууд CLO бүрд агуулагдсан байна.',
        // });
      }
      // 1. MIN > MAX шалгах
      this.cloQuestionData.forEach((i) => {
        if (this.isValidRange(i.min, i.max) && i.min > i.max) {
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
            // this.msgService.add({
            //   severity: 'error',
            //   summary: 'Алдаа',
            //   detail: `CLO '${a.cloName}' = [${a.min} - ${a.max}] нь '${b.cloName}' = [${b.min} - ${b.max}] хүрээтэй давхцаж байна.`,
            // });
          } else {
            this.activeAction = true;
          }
        }
        // }
      }
    }
  }

  // ✅ Range шалгах туслах функц
  private isValidRange(min: any, max: any): boolean {
    return min != null && min !== '' && max != null && max !== '';
  }

  // ✅ Давхцал шалгах функц
  private isOverlap(
    min1: number,
    max1: number,
    min2: number,
    max2: number
  ): boolean {
    return min1 <= max2 && max1 >= min2;
  }

  save() {
    let countQWEwe = 0;
    let allreadyInStudent = 0;
    let newStudent = 0;
    let id = 'null';
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
      lessonId: string;
      studentId: string;
      allPoint: number;
      takePoint: string;
      startDate: string;
      endDate: string;
      durationDate: string;
      question: {
        questionId: number;
        cloId: string;
        allPoint: number;
        takePoint: number;
      }[];
    }[] = [];

    this.cloQuestionData.map((data) => { });

    // Логикийг шалгаж эхэлнэ
    if (!this.activeFileLogic) {
      this.msgService.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: `Алдаатай Файл оруулсан байна зөв файлаа оруулж хадгалах товчоо дарна уу!`,
      });
    } else {
      if (!this.checkCloCount) {
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: `Дараах тоонууд хамрагдаагүй байна: ${this.missingNumberCount.join(
            ', '
          )}`,
        });
      } else {
        if (!this.activeAction) {
          this.msgService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: `Clo бүрт асуултуудыг зөв харгалзуулж оруулна уу!`,
          });
        } else {
          if (!this.examTypeAction) {
            this.msgService.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: `Шалгалтын төрлөө сонгоно уу!`,
            });
          } else {

            this.service
              .getAllLessonAssments(this.lessonId)
              .subscribe((res) => {
                this.lessonAllStudents = res;
                // tableData-д ажиллана
                this.tableData.forEach((e, index) => {
                  if (index !== 0) {
                    // Хоёрдугаар мөрөөс эхэлнэ
                    const assessmentFormData = {
                      lessonId: '',
                      studentId: '',
                      allPoint: 0,
                      takePoint: '',
                      startDate: '',
                      endDate: '',
                      durationDate: '',
                      examType: '',
                      examTypeName: '',
                      lastName: '',
                      firstName: '',
                      gmail: '',
                      status: '',
                      question: [] as {
                        questionId: number;
                        cloId: string;
                        allPoint: number;
                        takePoint: number;
                      }[],
                    };
                    assessmentFormData.lessonId = this.lessonId;

                    assessmentFormData.allPoint = Number(
                      this.tableData[0][8].substring(6, 8)
                    );
                    assessmentFormData.lastName = e[0];
                    assessmentFormData.firstName = e[1];
                    assessmentFormData.studentId = e[2];
                    assessmentFormData.gmail = e[3];
                    assessmentFormData.takePoint = e[8];
                    assessmentFormData.status = e[4];
                    assessmentFormData.startDate = e[5];
                    assessmentFormData.endDate = e[6];
                    assessmentFormData.durationDate = e[7];
                    assessmentFormData.examType = this.examTypeData.value;
                    assessmentFormData.examTypeName = this.examTypeData.label;
                    let questions: {
                      questionId: number;
                      cloId: any;
                      allPoint: number;
                      takePoint: any;
                    }[] = [];

                    let countQuetion = 1;
                    for (let j = 9; j < e.length; j++) {
                      this.cloQuestionData.map((data) => {
                        if (data.min <= countQuetion && data.max >= countQuetion) {
                          const question = {
                            questionId: countQuetion,
                            cloId: data.cloId,
                            allPoint:
                              countQuetion > 9
                                ? Number(this.tableData[0][j].substring(8, 12))
                                : Number(this.tableData[0][j].substring(6, 12)),
                            takePoint: e[j],
                          };

                          questions.push(question);
                        }
                      });
                      countQuetion++;
                    }

                    assessmentFormData.question = questions;
                    assessmentFormDataParam.push(assessmentFormData);
                    // if (countQWEwe <= 1) {
                    let checkData = true;
                    if (this.lessonAllStudents.length > 0) {
                      this.lessonAllStudents.map((beforeData: any) => {
                        if (assessmentFormData.studentId === beforeData.studentId) {
                          id = beforeData._id;
                          checkData = false;
                        }
                      });
                    }
                    if (assessmentFormData.studentId == null && assessmentFormData.studentId == undefined) {
                      checkData = false;
                    }
                    if (assessmentFormData.gmail == null && assessmentFormData.gmail == undefined) {
                      checkData = false;
                    }
                    if (checkData) {
                      this.lessonAssessmentService
                        .createLesAssessment(assessmentFormData)
                        .subscribe((res) => {
                          console.log(res);
                        });
                      newStudent++;
                    } else {
                      if (this.checked) {
                        if (id !== null && id !== undefined) {
                          this.lessonAssessmentService
                            .updateLesAssessment(id, assessmentFormData)
                            .subscribe((res) => {
                              console.log(res);
                            });
                        }
                      }
                      allreadyInStudent++;
                    }
                    //   countQWEwe = countQWEwe + 1;
                    // }
                  }
                });
                this.serviceAfterMsg(newStudent, allreadyInStudent);
              });
          }
        }
        console.log(assessmentFormDataParam);
      }
    }
  }
  serviceAfterMsg(newStudent: any, allreadyInStudent: any) {
    if (newStudent != 0) {
      this.msgService.add({
        severity: 'success',
        summary: 'Амжилттай',
        detail: `Шинээр '${newStudent}' сурагчийн дүн амжилттай бүртгэгдлээ.`,
      });
    }
    if (allreadyInStudent != 0) {
      this.msgService.add({
        severity: 'success',
        summary: 'Амжилттай',
        detail: `Нийт :'${allreadyInStudent}' сурагчдын дүнг засаж орууллаа.`,
      });
    }
  }

  examTypesData(e: any) {
    if (e.value !== null && e.examType !== undefined) {
      this.examTypeAction = false;
    } else {
      this.examTypeData = e;
      this.examTypeAction = true;
    }
    console.log(e);
  }
}
