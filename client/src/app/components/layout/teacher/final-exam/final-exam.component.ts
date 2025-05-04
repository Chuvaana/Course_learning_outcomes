import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FinalExamService } from '../../../../services/finalExamService';
import { TagModule } from 'primeng/tag';
import { Select } from 'primeng/select';
import { ActivatedRoute } from '@angular/router';
import { CLOService } from '../../../../services/cloService';
import { forkJoin } from 'rxjs';
import { PdfExamQuestionService } from '../../../../services/pdf-exam-question.service';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';

interface finalExamModel {
  finalExamName: string;
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

  clonedFinalExam: { [s: string]: finalExamQuestionModel } = {};

  constructor(private pdfService: PdfExamQuestionService,
    private cloService: CLOService, private route: ActivatedRoute, private service: FinalExamService, private messageService: MessageService) { }

  ngOnInit() {
    this.finalExams = {
      finalExamName: '',
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

    this.onRefresh();
  }

  onRefresh() {
    this.service.getLessonDataFinalExams(this.lessonId).subscribe((res: any) => {
      if (res.length > -1) {
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

  addColumn() {
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
    };

    this.finalExamQuestions.unshift(addData); // 👈 Add to the beginning
    // this.finalExamQuestions.push(addData);

    this.onRowEditInit(addData);
  }

  pdfExport() {

    forkJoin({
      cloList: this.service.getCloList(this.lessonId),
      mainInfo: this.service.getMainInfo(this.lessonId),
    }).subscribe((results: any) => {
      let cloData :any[] = [];
      this.finalExamQuestions.map((i: any) => {
        results.cloList.map((e: any) =>{
          if(i.cloCode === e.id){
            if(cloData.length > 0){
              let checkBeforeUse = false;
              cloData.map((check : any)=>{
                if(check.id === e.id){
                  checkBeforeUse = true;
                }
              });
              if( !checkBeforeUse ){
                cloData.push(e);
              }
            }else{
              cloData.push(e);
            }
          }
        })
      });
      results.cloList = cloData;

      this.mainInfoData = results.mainInfo;
      results.finalExamQuestions = this.finalExamQuestions; // 👈 Add here properl
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
}
