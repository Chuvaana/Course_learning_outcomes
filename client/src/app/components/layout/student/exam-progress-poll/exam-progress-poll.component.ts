import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ProgressPollService } from '../../../../services/progressPollService';
import { ButtonModule } from 'primeng/button';
import {  FloatLabelModule } from 'primeng/floatlabel';
import { FieldsetModule } from 'primeng/fieldset';

interface Question {
  name: string;
  code: string;
}

@Component({
  selector: 'app-exam-progress-poll',
  imports: [ FieldsetModule, ReactiveFormsModule, FloatLabelModule, ButtonModule, Rating, CommonModule, TextareaModule, CheckboxModule, DropdownModule, InputTextModule, IftaLabelModule, RouterModule, TieredMenuModule, ToastModule, FormsModule],
  templateUrl: './exam-progress-poll.component.html',
  styleUrl: './exam-progress-poll.component.scss',
})
export class ExamProgressPollComponent {
  lessonId: string = '';
  items: MenuItem[] | undefined;
  value: string | undefined;
  loading: boolean = false;
  createActive: boolean = false;
  progressPollId: any;
  sendAnswer!: {
    subQuestions: any[];
    lessonId: any;
    studentId: any;
    pollQuestionId: any;
  };
  // sendAnswer : {
  //   subQuestions: [];
  //   lessonId: any;
  //   studentId: any;
  //   pollQuestionId: any;
  // };

  questionTypes: Question[] | undefined;

  checked: boolean = false;
  selectedCity: Question | undefined;
  dataQuestions : any;

  answers: { text: string; answerId: number, answerValue: number, status: string, statusName: string }[] = [
    { text: '', answerId: 0, answerValue: 0, status : 'ACTIVE', statusName: 'Идэвхтэй' }
  ];

  questions: {
    value: string;
    lessonId: string;
    studentId: string;
    pollQuestionId: string;
    questionSubName: string;
    questionName: string;
    questionType: string;
    questionTypeName: string;
    totalPoint: any;
    dateOfReplyTime: any;
    answers: { answerName: string; answerId:number, answerValue: number }[];
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: ProgressPollService
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    if (this.lessonId) {
      this.refreshDetail();
    }
    this.questionTypes = [
      { name: 'Үнэлгээ өгөх', code: 'RATE' },
      { name: 'Хариулт бичих', code: 'FEEDBACK' }
    ];

    this.sendAnswer = {
      subQuestions: [],
      lessonId: '',
      studentId: '',
      pollQuestionId: ''
    };
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false
    }, 2000);
  }

  onAnswerClick() {

  }
  onRemove(answerIndex: number, questionIndex: number) {
    const question = this.dataQuestions[questionIndex];

    // If only one question exists
    if (this.dataQuestions.length === 1) {
      if (question.answers.length === 1) {
        // Remove the only question
        this.dataQuestions.splice(questionIndex, 1);
      } else {
        // Just remove the answer
        question.answers.splice(answerIndex, 1);
      }
    } else {
      if (question.answers.length === 1) {
        // Remove the entire question if it has only one answer
        this.dataQuestions.splice(questionIndex, 1);
      } else {
        // Just remove the answer
        question.answers.splice(answerIndex, 1);
      }
    }
  }

  // Хариултын текст өөрчлөгдөхөд
  onTextInput(answerIndex: number, questionIndex: number) {
    const changedAnswer = this.questions[questionIndex].answers[answerIndex];
    console.log(`Question ${questionIndex}, Answer ${answerIndex}:`, changedAnswer);
  }
  onQuestionType(e: any) {
    console.log("asdasd : " + e.code);
  }
  refreshDetail() {
    this.service.getAllLessonAssments(this.lessonId).subscribe((e: any) => {
      const dataPush = [];
      console.log(e);
      this.progressPollId = e[0]._id;
      if(e.length > 0){
        this.dataQuestions = e;
      }
      // this.createActive = true;
    });
  }
  save() {
    if(this.dataQuestions.length > 0){
      this.dataQuestions.map((i : any, index : any) =>{
        console.log(i);
        i.lessonId = '67f21da15d1c9f9efbf37dd9';
        i.studentId = 'B2109100';
        i.dateOfReplyTime = '2024-12-12';
        i.pollQuestionId = 'B21';
        i.answers.map((answer:any)=>{
          answer.answerValue = answer.answerValue.toString();
          // if(answer.questionType.code !== undefined && answer.questionType.code !== null){
          //   answer.answerValue = answer.questionType.name;
          //   answer.questionType = answer.questionType.code;
          // }
        });
      });
      if (!this.sendAnswer) {
        this.sendAnswer = {
          subQuestions: [],
          lessonId: '',
          studentId: '',
          pollQuestionId: ''
        };
      }
      this.sendAnswer.subQuestions = this.dataQuestions;
      this.sendAnswer.lessonId = '67f21da15d1c9f9efbf37dd9';
      this.sendAnswer.studentId = 'B2109100';
      this.sendAnswer.pollQuestionId = 'B21';
      console.log(this.sendAnswer);
      if (!this.createActive) {
        this.service.createStudentsSendPollQues(this.sendAnswer).subscribe((e: any) => {
          this.progressPollId = e._id;
          this.refreshDetail();
        });
      } else {
        this.service.updatePollQuestions(this.progressPollId, this.sendAnswer).subscribe((e: any) => {
          this.progressPollId = e._id;
          this.refreshDetail();
        });
      }
    }
  }
  onBranchChange(e : any) {
    console.log(e);
  }
}
