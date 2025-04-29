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
import { FloatLabelModule } from 'primeng/floatlabel';
import { FieldsetModule } from 'primeng/fieldset';
import { forkJoin } from 'rxjs';

interface Question {
  name: string;
  code: string;
}
interface questionItem {
  totalPoint: any;
  allPoint: any;
  questionTitle: any;
  questionId: any;
  answerValue: any;
  questionType: any;
  questionTypeName: any;
}

interface groupAnswerList {
  totalPoint: any;
  allPoint: any;
  groupId: any;
  groupName: any;
  questionList: questionItem[];
}

interface questionPollList {
  lessonId: any;
  studentId: any;
  totalPoint: any;
  allPoint: any;
  pollQuestionId: any;
  groupList: groupAnswerList[];
}

@Component({
  selector: 'app-exam-progress-poll',
  imports: [FieldsetModule, ReactiveFormsModule, FloatLabelModule, ButtonModule, Rating, CommonModule, TextareaModule, CheckboxModule, DropdownModule, InputTextModule, IftaLabelModule, RouterModule, TieredMenuModule, ToastModule, FormsModule],
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

  questionItem: questionItem[] = [];
  groupAnswerList: groupAnswerList | undefined;
  groupList: questionItem[] = [];
  questionPollList: questionPollList | undefined;

  questionTypes: Question[] | undefined;

  checked: boolean = false;
  selectedCity: Question | undefined;
  dataQuestions: any;

  answers: { text: string; answerId: number, answerValue: number, status: string, statusName: string }[] = [
    { text: '', answerId: 0, answerValue: 0, status: 'ACTIVE', statusName: 'Идэвхтэй' }
  ];

  questions: {
    groupId: string;
    groupName: string;
    studentId: string;
    pollQuestionId: string;
    questionSubName: string;
    questionName: string;
    questionType: string;
    questionTypeName: string;
    totalPoint: any;
    dateOfReplyTime: any;
    answers: { answerName: string; answerId: number, answerValue: number }[];
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
      this.refreshStudentId();
    }
    this.questionTypes = [
      { name: 'Үнэлгээ өгөх', code: 'RATE' },
      { name: 'Хариулт бичих', code: 'FEEDBACK' }
    ];

    // this.groupList = {
    //   questionList: [],
    //   groupName: '',
    //   groupId: ''
    // };
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
    forkJoin({
      assessment: this.service.getAllLessonAssments(this.lessonId),
    }).subscribe((results) => {
      console.log('Бүх өгөгдөл:', results);
    });
    this.service.getAllLessonAssments(this.lessonId).subscribe((e: any) => {
      const dataPush = [];
      console.log(e);
      this.progressPollId = e[0]._id;
      if (e.length > 0) {
        if (e.studentId === "B200950009") {
          this.refreshStudentId();
        }
        this.dataQuestions = e;
      }
      // this.createActive = true;
    });
  }

  refreshStudentId() {
    this.service.getAllStudentsSendPollQuess().subscribe((e: any) => {
      const dataPush = [];
      console.log(e);
      let action = false;
      let data = null;
      e.map((i: any, index : any) => {
        if (i.studentId === "B200950009") {
          action = true;
          data = i.groupList;
        }
      });
      if (!action) {
        this.refreshDetail();
      } else {
        this.createActive = true;
        this.dataQuestions = data;
      }
    });
  }
  save() {
    if (this.dataQuestions.length > 0) {
      this.questionPollList = {
        lessonId: '',
        studentId: '',
        totalPoint: '',
        allPoint: '',
        pollQuestionId: '',
        groupList: [],
      };
      const groupAnswerList: any[] = [];
      let lessonId = null;
      this.dataQuestions.map((i: any, index: any) => {
        lessonId = i.lessonId;
        this.groupAnswerList = {
          totalPoint: 5,
          allPoint: 5,
          groupId: i._id,
          groupName: i.groupName,
          questionList: []
        };

        console.log(i);

        this.groupList = [];

        i.questionList.map((quest: any) => {
          const questionItem: questionItem = {
            totalPoint: 5,
            allPoint: 5,
            questionTitle: quest.questionTitle,
            questionId: quest._id ?? null,
            answerValue: quest.answerValue?.toString(),
            questionType: quest.questionType ?? '',
            questionTypeName: quest.questionTypeName ?? ''
          };

          this.groupList.push(questionItem);
        });

        this.groupAnswerList.questionList = this.groupList;
        groupAnswerList.push(this.groupAnswerList);
      });
      this.questionPollList.studentId = 'B200950009';
      this.questionPollList.lessonId = lessonId;
      this.questionPollList.groupList = groupAnswerList;



      console.log(this.questionPollList);
    }
    if (!this.createActive) {
      this.service.createStudentsSendPollQues(this.questionPollList).subscribe((e: any) => {
        this.progressPollId = e._id;
        this.refreshStudentId();
      });
    } else {
      this.service.updatePollQuestions(this.progressPollId, this.questionPollList).subscribe((e: any) => {
        this.progressPollId = e._id;
        this.refreshDetail();
      });
    }
  }
  onBranchChange(e: any) {
    console.log(e);
  }
}
