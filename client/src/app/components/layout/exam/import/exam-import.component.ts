import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api'; // ✅ MessageService-г импортлох
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast'; // ✅ Toast-г импортлох
import * as XLSX from 'xlsx';
import { ExamService } from '../../../../services/examService';
import { lessonAssessmentService } from '../../../../services/lessonAssessment';
import { AssessmentService } from '../../../../services/assessmentService';
import { CloPointPlanService } from '../../../../services/cloPointPlanService';
import { Select, SelectModule } from 'primeng/select';

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
    // Select,
    // SelectModule,
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
  subMethods: any[] = [];
  // subMethodsy: any[] = [];

  cities: City[] | undefined;

  examTypeAction = false;
  examType: any = null;
  examTypeData: any = null;
  cloRanges: { [cloId: string]: { min: number, max: number } } = {};

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
    { value: 'EXAM', label: 'Улирлын шалгалт' },
    { value: 'QUIZ1', label: 'Сорил 1' },
    { value: 'QUIZ2', label: 'Сорил 2' },
  ];

  clos: any[] = []; // Initialize to avoid undefined issues
  formGroup: any;
  constructor(
    private fb: FormBuilder,
    private service: ExamService,
    private route: ActivatedRoute,
    private msgService: MessageService,
    private lessonAssessmentService: lessonAssessmentService,
    private assessService: AssessmentService,
    private cloPointPlanService: CloPointPlanService
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

    let subMethod: any[] = [];

    // this.service.getLessonDataFinalExams(this.lessonId).subscribe((res: any) => {
    //   if (res.length > -1) {
    //     this.examTypes.map((e) => {
    //       this.assessService.getAssessmentByLesson(this.lessonId)
    //         .subscribe((res: any) => {
    //           const data = res?.plans.filter((item: any) => {
    //             return item.methodType === e.value;
    //           });

    //           data[0].subMethods.map((e: any) => {
    //             const dataSub = {
    //               id: e._id,
    //               label: e.subMethod,
    //               point: e.point,
    //             };
    //             subMethod.push(dataSub);
    //           });
    //           this.subMethodsy = subMethod;
    //           console.log(data);
    //         });
    //     });
    //   }
    // });
  }

  loadClo(e: string): void {
    let subMethods: any[] = [];
    let subMethodOrder: any[] = [];
    let cloList: any[] = [];
    this.assessService
      .getAssessmentByLesson(this.lessonId)
      .subscribe((res: any) => {
        const data = res?.plans.filter((item: any) => {
          return item.methodType === e;
        });

        data.forEach((item: any) => {
          item.subMethods.forEach((sub: any) => {
            subMethodOrder.push(sub);
            subMethods.push(sub._id);
          });
        });
        this.subMethods = subMethodOrder;

        this.cloPointPlanService
          .getPointPlan(this.lessonId)
          .subscribe((response) => {
            response.forEach((i: any) => {
              let found = false; // Энэ i дээр examPoints-д match олдсон эсэх

              i.examPoints.forEach((exam: any) => {
                if (subMethods.includes(exam.subMethodId) && exam.point != 0) {
                  if (!cloList.includes(i.cloId)) {
                    cloList.push(i.cloId);
                  }
                  found = true; // Match олдсон тул found = true болгоно
                }
              });

              if (!found) {
                // Хэрвээ examPoints дээр match олдоогүй бол procPoints-оос хайна
                i.procPoints.forEach((proc: any) => {
                  if (
                    subMethods.includes(proc.subMethodId) &&
                    proc.point != 0
                  ) {
                    if (!cloList.includes(i.cloId)) {
                      cloList.push(i.cloId);
                    }
                  }
                });
              }
            });
            this.assessService
              .getCloList(this.lessonId)
              .subscribe((data: any[]) => {
                const closData: any[] = [];

                if (data) {
                  // cloList-д орсон ID-тай таарах clos-уудыг үлдээ
                  const filteredClos = data.filter((dat: any) => {
                    return cloList.includes(dat.id);
                  });

                  this.cloCount = filteredClos.length;
                  filteredClos.forEach((i) => {
                    closData.push(i);

                    const cloQuestion = {
                      cloId: i.id,
                      cloName: i.cloName,
                      max: null,
                      min: null,
                    };

                    this.cloQuestionData.push(cloQuestion);
                  });
                  this.clos = closData;
                }
              });
          });
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
      this.tableData = this.tableData.filter(e => e.length !== 0);

      this.studentCount = this.tableData.length - 1;
      // this.tableData.push(data);

      // Зөв файл оруулж байгааг шалгах
      const defaultData = this.tableData[0];
      const fileLogic = this.checkData(defaultData);
      let countLogic = false;
      let checkFirstLength = 0;
      let checkAction = false;
      defaultData.map((data: any, index: any) => {
        if (!checkAction) {
          if (data.slice(0, 2) === 'Q.') {
            checkFirstLength = defaultData.length - index;
            checkAction = true;
          }
        }
      })
      let checkFirstLengthIn = defaultData.length - checkFirstLength;
      console.log(checkFirstLength);

      let emptyRow: any[] = [];
      emptyRow = new Array((checkFirstLengthIn + 1)).fill('xD');   // Fill with '' or null as needed
      this.service.getLessonDataFinalExams(this.lessonId).subscribe((res: any) => {
        this.cloRanges = {};
        let checkNumber = '';
        let countLength = 0;
        let beforeMax = 1;
        let beforeMin = 1;

        res.map((subs: any, index: any) => {
          if (checkNumber === '') {
            checkNumber = subs.cloCode;
            countLength = 1;
          } else if (checkNumber === subs.cloCode) {
            countLength++;
          } else {
            this.cloRanges[checkNumber] = {
              min: beforeMax,
              max: beforeMax + countLength - 1
            };
            beforeMax += countLength;

            checkNumber = subs.cloCode;
            countLength = 1;
          }

          if (index === res.length - 1) {
            this.cloRanges[checkNumber] = {
              min: beforeMax,
              max: checkFirstLength
            };
          }
          if (subs.finalExamType === this.examType.value) {
            this.subMethods.map((subsData: any) => {
              if (subs.subMethod === subsData._id) {
                const dataSub = {
                  _id: subsData._id,
                  label: subsData.subMethod,
                  point: subsData.point,
                  cloId: checkNumber,
                };
                emptyRow.push(dataSub);
              }
            });
          }
        });

        countLogic = this.checkCount(res, checkFirstLength);
        this.tableData.splice(1, 0, emptyRow);
        if (!countLogic) {
          this.tableData = [];
        }
      });
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

  checkCount(res: any, defaultData: any): boolean {
    if (res.length !== defaultData) {
      let count = defaultData - res.length;
      if (count > 0) {
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: `Алдаа гарлаа: Шалгалтын асуултууд ба суралцхуйн үр дүнгийн хамааралын асуултын тоо дутуу бүртгэгдсэн байна! : ${count}')`,
        });
      } else {
        count = count * -1;
        this.msgService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: `Алдаа гарлаа: Шалгалтын асуултууд ба суралцхуйн үр дүнгийн хамааралын асуултын тоо хэтэрсэн байна! : ${count}')`,
        });
      }
      return false;
    } else {
      return true;
    }
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

  // checkValue(cloId: any, value: any, type: 'min' | 'max') {
  //   // 3. Орхигдсон утгууд шалгах

  //   if (this.questionAmount > 0) {
  //     // if (this.questionAmount >= value && type === 'max') {
  //     const allSelectedNumbers: Set<number> = new Set();

  //     // min/max утгыг шинэчилж байна
  //     this.cloQuestionData.forEach((i) => {
  //       if (i.cloId === cloId) {
  //         if (type === 'max') {
  //           if (value == '') {
  //             i.max = 0;
  //           } else {
  //             i.max = Number(value);
  //           }
  //         } else {
  //           if (value == '') {
  //             i.min = 0;
  //           } else {
  //             i.min = Number(value);
  //           }
  //         }
  //       }

  //       if (this.isValidRange(i.min, i.max)) {
  //         for (let n = i.min; n <= i.max; n++) {
  //           allSelectedNumbers.add(n);
  //         }
  //         console.log(allSelectedNumbers);
  //       }
  //     });

  //     const missingNumbers: number[] = [];
  //     for (let i = 1; i <= this.questionAmount; i++) {
  //       if (!allSelectedNumbers.has(i)) {
  //         missingNumbers.push(i);
  //       }
  //     }

  //     if (missingNumbers.length > 0) {
  //       this.checkCloCount = false;
  //       // this.msgService.add({
  //       //   severity: 'warn',
  //       //   summary: 'Анхааруулга',
  //       //   detail: `Дараах тоонууд хамрагдаагүй байна: ${missingNumbers.join(
  //       //     ', '
  //       //   )}`,
  //       // });
  //       this.missingNumberCount = missingNumbers;
  //     } else {
  //       this.checkCloCount = true;
  //       // this.msgService.add({
  //       //   severity: 'success',
  //       //   summary: 'Амжилттай',
  //       //   detail: 'Бүх асуултууд CLO бүрд агуулагдсан байна.',
  //       // });
  //     }
  //     // 1. MIN > MAX шалгах
  //     this.cloQuestionData.forEach((i) => {
  //       if (this.isValidRange(i.min, i.max) && i.min > i.max) {
  //         this.msgService.add({
  //           severity: 'error',
  //           summary: 'Алдаа',
  //           detail: `MIN = '${i.min}' утга MAX = '${i.max}' утгаас их байна.`,
  //         });
  //       }
  //     });

  //     // 2. Davhtsaj bui range шалгах
  //     for (let i = 0; i < this.cloQuestionData.length; i++) {
  //       const a = this.cloQuestionData[i];
  //       if (!this.isValidRange(a.min, a.max)) continue;

  //       for (let j = 0; j < this.cloQuestionData.length; j++) {
  //         const b = this.cloQuestionData[j];
  //         if (i === j || !this.isValidRange(b.min, b.max)) continue;

  //         if (this.isOverlap(a.min, a.max, b.min, b.max)) {
  //           // this.msgService.add({
  //           //   severity: 'error',
  //           //   summary: 'Алдаа',
  //           //   detail: `CLO '${a.cloName}' = [${a.min} - ${a.max}] нь '${b.cloName}' = [${b.min} - ${b.max}] хүрээтэй давхцаж байна.`,
  //           // });
  //         } else {
  //           this.activeAction = true;
  //         }
  //       }
  //       // }
  //     }
  //   }
  // }

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
          const subMethodClolumn = this.tableData[1];
          this.service
            .getAllLessonAssments(this.lessonId)
            .subscribe((res) => {
              this.lessonAllStudents = res;
              // tableData-д ажиллана
              this.tableData.forEach((e, index) => {
                if (index > 1) {
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
                      subMethodId: string,
                      subMethodName: string,
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
                    subMethodId: string;
                    subMethodName: string;
                  }[] = [];

                  let countQuetion = 1;
                  for (let j = 9; j < e.length; j++) {
                    const col = subMethodClolumn[j + 1] ?? subMethodClolumn[j];
                    // this.cloQuestionData.map((data) => {
                    //   if (
                    //     data.min <= countQuetion &&
                    //     data.max >= countQuetion
                    //   ) {
                    const question = {
                      questionId: countQuetion,
                      cloId: col?.cloId,
                      allPoint:
                        countQuetion > 9
                          ? Number(this.tableData[0][j].substring(8, 12))
                          : Number(this.tableData[0][j].substring(6, 12)),
                      takePoint: e[j],
                      subMethodId: col?._id,
                      subMethodName: col?.label,
                    };

                    questions.push(question);
                    //   }
                    // });
                    countQuetion++;
                  }

                  assessmentFormData.question = questions;
                  assessmentFormDataParam.push(assessmentFormData);
                  // if (countQWEwe <= 1) {
                  let checkData = true;
                  if (this.lessonAllStudents.length > 0) {
                    this.lessonAllStudents.map((beforeData: any) => {
                      if (
                        assessmentFormData.studentId === beforeData.studentId
                        && beforeData.examType === assessmentFormData.examType
                      ) {
                        id = beforeData._id;
                        checkData = false;
                      }
                    });
                  }
                  if (
                    assessmentFormData.studentId == null &&
                    assessmentFormData.studentId == undefined
                  ) {
                    checkData = false;
                  }
                  if (
                    assessmentFormData.gmail == null &&
                    assessmentFormData.gmail == undefined
                  ) {
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
    let dataIn = false;
    if (e.value !== null) {
      this.service.getLessonDataFinalExams(this.lessonId).subscribe((res: any) => {
        res.map((subs: any, index: any) => {
          if (subs.finalExamType === this.examType.value) {
            dataIn = true;
          }
        });
        this.examTypesDatas(e, dataIn);
      });
    } else {
      this.examTypeData = e;
      this.examTypeAction = true;
    }
  }
  examTypesDatas(e: any, dataIn: boolean) {
    console.log(e);
    if (dataIn) {
      this.tableData = [];
      this.examTypeAction = false;
      // this.msgService.add({
      //   severity: 'success',
      //   summary: 'Амжилттай',
      //   detail: `Нийт : сурагчдын дүнг засаж орууллаа.`,
      // });
      this.loadClo(e.value);
    } else {
      this.msgService.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: `Шалгалтын асуултууд ба суралцхуйн үр дүнгийн хамаарал бүртгээгүй байна!`,
      });
    }


  }

  subMethodTypesData(e: any) {

  }
}
