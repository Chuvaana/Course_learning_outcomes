import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import { ProgressPollService } from '../../../../services/progressPollService';
import { Image } from 'primeng/image';

interface Question {
  name: string;
  code: string;
}
interface QuestionItem {
  questionTitle: string;
  questionId: string;
  answerValue: number;
  questionType: string;
  questionTypeName: string;
  cloId: string;
}

interface GroupAnswerList {
  groupId: string;
  groupName: string;
  groupType: string;
  questionList: QuestionItem[];
}

interface questionPollList {
  lessonId: string;
  studentId: string;
  pollQuestionId: string;
  groupList: GroupAnswerList[];
}

@Component({
  selector: 'app-exam-progress-poll',
  imports: [
    FieldsetModule,
    ReactiveFormsModule,
    FloatLabelModule,
    ButtonModule,
    Rating,
    CommonModule,
    TextareaModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    IftaLabelModule,
    RouterModule,
    TieredMenuModule,
    ToastModule,
    FormsModule,
    Image,
  ],
  providers: [MessageService],
  templateUrl: './exam-progress-poll.component.html',
  styleUrl: './exam-progress-poll.component.scss',
})
export class ExamProgressPollComponent {
  lessonId: string = '';
  items: MenuItem[] | undefined;
  value: string | undefined;
  loading: boolean = false;
  createActive: boolean = false;
  dateActive: boolean = false;
  progressPollId!: string;

  questionItem: QuestionItem[] = [];
  groupAnswerList: GroupAnswerList | undefined;
  groupList: QuestionItem[] = [];
  questionPollList: questionPollList | undefined;

  questionTypes: Question[] | undefined;

  checked: boolean = false;
  selectedCity: Question | undefined;
  dataQuestions: any;

  studentCode: any;

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
    answers: { answerName: string; answerId: number; answerValue: number }[];
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private service: ProgressPollService
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    this.studentCode = localStorage.getItem('studentCode') ?? '';
    console.log(this.studentCode);
    if (this.lessonId) {
      this.refreshDetail();
    }
    this.questionTypes = [
      { name: 'Үнэлгээ өгөх', code: 'RATE' },
      { name: 'Хариулт бичих', code: 'FEEDBACK' },
    ];
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  onAnswerClick() { }
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
    console.log(
      `Question ${questionIndex}, Answer ${answerIndex}:`,
      changedAnswer
    );
  }

  onQuestionType(e: any) {
    console.log('asdasd : ' + e.code);
  }

  refreshDetail() {
    this.service.getAllLessonAssments(this.lessonId).subscribe((e: any) => {
      if (e.length > 0) {
        const nowDate = new Date();
        this.progressPollId = e[0]._id;
        const startDate = new Date(e[0].startDate);
        const endDate = new Date(e[0].endDate);
        if (startDate > nowDate) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Анхааруулга',
            detail: `Санал асуулга өгөх хугацаа болоогүй байна!`,
          });
          this.dateActive = true;
        } else if (endDate < nowDate) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Анхааруулга',
            detail: `Санал асуулга өгөх хугацаа өнгөрсөн байна!`,
          });
          this.dateActive = true;
        } else {
          this.dataQuestions = e[0].questions;
        }
        this.refreshStudentId();
      }
    },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Алдаа гарлаа!: ' + err.message,
        });
      });
  }

  refreshStudentId() {
    this.service.getAllStudentsSendPollQuess().subscribe((e: any) => {
      let action = false;
      let data = null;
      e.map((i: any, index: any) => {
        if (i.studentId === this.studentCode) {
          action = true;
          data = i.groupList;
        }
      });
      if (action) {
        this.createActive = true;
        this.dataQuestions = data;
      }
    },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Алдаа гарлаа!: ' + err.message,
        });
      });
  }
  save() {
    if (this.dataQuestions.length > 0) {
      this.questionPollList = {
        lessonId: this.lessonId,
        studentId: '',
        pollQuestionId: '',
        groupList: [],
      };
      const groupAnswerList: any[] = [];
      this.dataQuestions.map((i: any, index: any) => {
        this.groupAnswerList = {
          groupId: i._id,
          groupName: i.groupName,
          groupType: i.groupType,
          questionList: [],
        };

        console.log(i);

        this.groupList = [];

        i.questionList.map((quest: any) => {
          const questionItem: QuestionItem = {
            questionTitle: quest.questionTitle,
            questionId: quest._id ?? null,
            answerValue: quest.answerValue?.toString(),
            cloId: quest.cloId ?? null,
            questionType: quest.questionType ?? '',
            questionTypeName: quest.questionTypeName ?? '',
          };

          this.groupList.push(questionItem);
        });

        this.groupAnswerList.questionList = this.groupList;
        groupAnswerList.push(this.groupAnswerList);
      });
      this.questionPollList.studentId = this.studentCode;
      this.questionPollList.groupList = groupAnswerList;

      console.log(this.questionPollList);
    }
    if (!this.createActive) {
      this.service
        .createStudentsSendPollQues(this.questionPollList)
        .subscribe((e: any) => {
          this.progressPollId = e._id;
          this.refreshStudentId();
        });
    } else {
      this.service
        .updatePollQuestions(this.progressPollId, this.questionPollList)
        .subscribe((e: any) => {
          this.progressPollId = e._id;
          this.refreshDetail();
        });
    }
  }
  onBranchChange(e: any) {
    console.log(e);
  }
}
