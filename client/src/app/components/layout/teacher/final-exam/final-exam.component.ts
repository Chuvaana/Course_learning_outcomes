import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FinalExamService } from '../../../../services/finalExamService';
import { TagModule } from 'primeng/tag';
import { Select, SelectModule } from 'primeng/select';
import { ActivatedRoute } from '@angular/router';
import { CLOService } from '../../../../services/cloService';
import { forkJoin } from 'rxjs';
import { PdfExamQuestionService } from '../../../../services/pdf-exam-question.service';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { MatDialog } from '@angular/material/dialog';
import { BlmInfoComponent } from './blm-info/blm-info.component';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

interface finalExamModel {
  finalExamName: any;
  lessonId: string;
  examType: string;
  examTakeStudentCount: any;
  finalExamQuestion: any;
}

interface finalExamQuestionModel {
  _id: any;
  orderId: number;
  verb: any;
  verbName: string;
  version: string;
  blmLvl: number;
  cloCode: any;
  cloName: string;
  examType: string;
  finalExamType: string;
  finalExamTypeName: string;
}

interface verbs {
  verbCode: string;
  verbName: string;
}

@Component({
  selector: 'app-final-exam',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    TagModule,
    InputNumber,
    Select,
    FloatLabel,
    SelectModule,
    IftaLabelModule,
    InputIconModule,
    IconFieldModule,
    ToastModule],
  providers: [MessageService],
  templateUrl: './final-exam.component.html',
  styleUrl: './final-exam.component.scss'
})
export class FinalExamQuestionsComponent implements OnInit {
  finalExams!: finalExamModel;
  finalExamQuestions!: finalExamQuestionModel[];
  verbs: any[] = [];
  lessonId: any;
  countOrder: any;
  clos: any[] = [];
  isNew = true;
  isNewEdit = false;
  cloListData: any;
  mainInfoData: any;
  resultData: any;
  finalExamsId: any;
  examType: any;
  examTakeStudentCount: any;
  cloneFinalExamQuestions: any;
  selectedExamType: any;
  searchQuery: string = '';
  searchValue: string | undefined;

  tableFilters: { [s: string]: any } = {
    'finalExamTypeName': { value: 'Тест', matchMode: 'contains' }  // Change 'Тест' to your desired default
  };

  examTypes = [
    { value: 'EXAM', label: 'Улирлын шалгалт' },
    { value: 'QUIZ1', label: 'Сорил 1' },
    { value: 'QUIZ2', label: 'Сорил 2' },
  ];

  clonedFinalExam: { [s: string]: finalExamQuestionModel } = {};
  @ViewChild('dt') dt!: Table;

  constructor(private pdfService: PdfExamQuestionService,
    private dialog: MatDialog,
    private cloService: CLOService, private route: ActivatedRoute, private service: FinalExamService, private messageService: MessageService) { }
  ngOnInit() {
    this.finalExams = {
      finalExamName: null,
      lessonId: '',
      examType: '',
      examTakeStudentCount: null,
      finalExamQuestion: null,
    };
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!; // Get "id" from the parent route
      console.log('Lesson ID:', this.lessonId);
    });

    this.finalExamQuestions = [];
    this.service.getCloList(this.lessonId).subscribe((data: any) => {
      let cloData: any[] = [];
      data.map((e: any) => {
        let verbs = {
          id: '',
          name: '',
        };
        verbs.id = e.id;
        verbs.name = e.cloName;
        cloData.push(verbs);
      });
      this.clos = cloData;
    });

    this.service.getVerb().subscribe((data: any) => {
      let verbData: any[] = [];
      data.map((e: any) => {
        let verbs = {
          verbCode: '',
          verbName: '',
        };
        verbs.verbCode = e._id;
        verbs.verbName = e.verbName;
        verbData.push(verbs);
      });
      this.verbs = verbData;
    });

    // this.dt.filter('EXAM', 'text', 'text');
    this.onRefresh();
  }

  onRefresh() {
    this.service.getLessonDataFinalExams(this.lessonId).subscribe((res: any) => {
      if (res.length > -1) {
        // this.finalExams.finalExamName = res[0].finalExamName;
        this.examTypes.map((e) => {
          if (e.value === res[0].finalExamName) {
            this.finalExams.finalExamName = e;
            this.onBranchChange(e);
          }
        });
        this.finalExams.examType = res[0].examType;
        this.finalExams.examTakeStudentCount = res[0].examTakeStudentCount;
        this.finalExamsId = res[0]._id;
        this.examType = res[0].examType;
        this.isNewEdit = true;
      } else {
        this.isNewEdit = false;
      }
    });
    this.service.getAllFinalExamQuestions(this.lessonId).subscribe((res: any) => {
      this.countOrder = res.length;
      this.finalExamQuestions = res;
    });


  }

  onRowEditInit(finalExam: finalExamQuestionModel) {

    if (finalExam._id !== "" && finalExam._id !== null && finalExam._id !== undefined) {
      this.isNew = false;
      this.service.getDetailVerb(finalExam.verb).subscribe((res: any) => {
        let dataType = {
          verbCode: '',
          verbName: '',
        };
        dataType.verbCode = res._id;
        dataType.verbName = res.verbName;
        finalExam.verb = dataType;
      });
      this.cloService.getCloList(this.lessonId).subscribe((res: any) => {
        res.map((e: any) => {
          if (e.id === finalExam.cloCode) {
            let dataType = {
              id: '',
              name: '',
            };
            dataType.id = e.id;
            dataType.name = e.cloName;
            finalExam.cloCode = dataType;
          }
        })
      })
    } else {
      this.isNew = true;
    }
    this.clonedFinalExam[finalExam._id as string] = { ...finalExam };
  }

  onRowEditSave(finalExam: finalExamQuestionModel) {
    finalExam.verbName = finalExam.verb.verbName;
    finalExam.verb = finalExam.verb.verbCode;
    finalExam.cloName = finalExam.cloCode.name;
    finalExam.cloCode = finalExam.cloCode.id;
    finalExam.finalExamTypeName = this.finalExams.finalExamName.label;
    finalExam.finalExamType = this.finalExams.finalExamName.value;
    delete this.clonedFinalExam[finalExam._id as string];
    this.save(finalExam);
  }

  onRowEditCancel(finalExam: finalExamQuestionModel, index: number) {
    this.finalExamQuestions[index] = this.clonedFinalExam[finalExam._id as string];
    delete this.clonedFinalExam[finalExam._id as string];
  }

  save(data: any) {
    data.orderId = Number(data.orderId);
    if (this.examType !== null && this.examType !== undefined) {
      data.examType = this.examType;
    }
    if (this.isNew) {
      this.service.addFinalExam(data).subscribe((res) => {
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'finalExam is updated' });
        this.onRefresh();
      },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        })
    } else if (!this.isNew) {
      this.service.updateFinalExam(data._id, data).subscribe((res) => {
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'finalExam is updated' });
        this.onRefresh();
      },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Алдаа гарлаа: ' + err.message,
          });
        })
    } else {
      // .. sonar aldaa
    }
  }

  onRowDelete(data: any, index: any) {
    if (data._id !== "" && data._id !== null && data._id !== undefined) {
      this.finalExamQuestions.splice(index, 1);

    } else {
      this.service.deleteFinalExam(data._id).subscribe((res: any) => {
        this.finalExamQuestions.splice(index, 1);
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Ажилттай', detail: 'Ажилттай устгалаа' });
      },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Устгахад алдаа гарлаа: ' + err.message,
          });
        })
    }
  }

  saveDataFull(data: any) {
    this.finalExams.finalExamQuestion = data;
    this.finalExams.lessonId = this.lessonId;
    this.finalExams.finalExamName = this.finalExams.finalExamName.value;
    // this.finalExams.examType = this.examType;
    // this.finalExams.examTakeStudentCount = this.examTakeStudentCount;

    if (this.isNewEdit) {
      this.service.editDataFinal(this.finalExamsId, this.finalExams).subscribe(
        (res) => {
          console.log(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Мэдээлэл амжилттай хадгалагдлаа',
          });
          this.onRefresh();
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Хадгалах явцад алдаа гарлаа: ' + err.message,
          });
        }
      );
    } else {
      this.service.addDataFinal(this.finalExams).subscribe(
        (res) => {
          console.log(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Мэдээлэл амжилттай хадгалагдлаа',
          });
          this.onRefresh();
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Хадгалах явцад алдаа гарлаа: ' + err.message,
          });
        }
      );
    }
  }

  addColumn(finalExamType: any) {
    const addData = {
      _id: null,
      lessonId: this.lessonId,
      orderId: this.countOrder + 1,
      verb: '',
      verbName: 'NULL',
      version: '1',
      blmLvl: 1,
      cloCode: '',
      cloName: 'NULL',
      examType: 'null',
      finalExamType: finalExamType.value,
      finalExamTypeName: finalExamType.label,
    };

    this.finalExamQuestions.unshift(addData); // 👈 Add to the beginning
    // this.finalExamQuestions.push(addData);
    this.onBranchChange(finalExamType);
    this.onRowEditInit(addData);
  }

  pdfExport() {

    forkJoin({
      cloList: this.service.getCloList(this.lessonId),
      mainInfo: this.service.getMainInfo(this.lessonId),
    }).subscribe((results: any) => {
      let cloData: any[] = [];
      this.finalExamQuestions.map((i: any) => {
        results.cloList.map((e: any) => {
          if (i.cloCode === e.id) {
            if (cloData.length > 0) {
              let checkBeforeUse = false;
              cloData.map((check: any) => {
                if (check.id === e.id) {
                  checkBeforeUse = true;
                }
              });
              if (!checkBeforeUse) {
                cloData.push(e);
              }
            } else {
              cloData.push(e);
            }
          }
        })
      });
      results.cloList = cloData;

      this.mainInfoData = results.mainInfo;
      const finalExamQuestion: any[] = [];
      const cloList: any[] = [];
      if (this.finalExamQuestions.length > 0) {
        this.finalExamQuestions.map((e: any) => {
          if (e.finalExamTypeName === this.searchQuery) {
            finalExamQuestion.push(e);
            results.cloList.map((i: any) => {
              let active = true;
              if (i.id === e.cloCode) {
                cloList.map((j : any) =>{
                  if(j.id === i.id){
                    active = false;
                  }
                });
                if(active){
                  cloList.push(i);
                }
              }
            });
          }
        });
      }
      if(cloList.length  > 0){
        results.cloList = cloList;
      }
      // results.finalExamQuestions = this.finalExamQuestions; // 👈 Add here properl
      results.finalExamQuestions = finalExamQuestion; // 👈 Add here properl
      results.finalExams = this.finalExams;
      console.log('Бүх өгөгдөл:', results);
      this.resultData = results;
      this.pdfService.generatePdf(this.resultData);
    },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Тайлан хэвлэхэд алдаа гарлаа бүтэн мэдээлэл оруулна уу!: ' + err.message,
        });
      }
    );
  }
  infoTo() {
    this.dialog.open(BlmInfoComponent, {
      width: '60vw',
      height: '50vh',
      maxWidth: 'none',
      data: { lessonId: this.lessonId }
    });
  }

  onBranchChange(e: any) {
    console.log(e);
    this.searchQuery = e.label;
    this.onSearchInput();
  }
  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }
  onSearchInput() {
    // Trigger the global filter
    this.dt.filterGlobal(this.searchQuery, 'contains');
  }
}
