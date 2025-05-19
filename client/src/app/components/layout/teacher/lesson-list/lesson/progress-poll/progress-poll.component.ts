import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ProgressPollService } from '../../../../../../services/progressPollService';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CLOService } from '../../../../../../services/cloService';
import { DatePicker } from 'primeng/datepicker';
import { CalendarModule } from 'primeng/calendar';

interface Question {
  name: string;
  code: string;
}

interface QueWithClo {
  questionTitle: string;
  questionType: string | Question;
  questionTypeName: string;
  cloId: string | null;
}

interface Ques {
  questionTitle: string;
  questionType: string | Question;
  questionTypeName: string;
}
interface mainData {
  lessonId: string;
  startDate: Date;
  endDate: Date;
  questions: QuestionList[];
}

type QuestionItem = Ques | QueWithClo;

interface QuestionList {
  lessonId: string;
  groupType: string;
  groupName: string;
  questionList: QuestionItem[];
}

@Component({
  selector: 'app-progress-poll',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    ButtonModule,
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
    DatePicker,
    CalendarModule,
  ],
  providers: [MessageService],
  templateUrl: './progress-poll.component.html',
  styleUrl: './progress-poll.component.scss',
})
export class ProgressPollComponent {
  lessonId: string = '';
  items: MenuItem[] | undefined;
  value: string | undefined;
  loading: boolean = false;
  createActive: boolean = false;
  progressPollId: string[] = [];
  startDate: any;
  endDate: any;
  questionTypes: Question[] | undefined;
  mainData: any;

  checked: boolean = false;
  selectedCity: Question | undefined;
  dataQuestions: QuestionList[] = [];

  popQuestion: QuestionList[] = [
    {
      lessonId: '',
      groupName: 'Ерөнхий үр дүн, Багшийн ёс зүй',
      groupType: 'GENERAL',
      questionList: [
        {
          questionTitle:
            'Та энэ багшийг сонгон хичээл судалсандаа сэтгэл ханамжтай байгаа эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Та энэ хичээлийг сонгон судалснаар хангалттай түвшинд мэдлэг, ур чадвар, хандлага эзэмшиж чадсан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш хичээлээ цагт нь эхлүүлж дуусгах;  хичээлийн явцад цагийг үр дүнтэй ашиглах зэргээр цагийн менежмент хийж чадсан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш оюутантай хүндэтгэлтэй харилцах; тэдний санал хүсэлтийг хүлээн авах; үлгэрлэх зэргээр багшийн ёс зүйн хэм хэмжээг хангаж чадсан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
      ],
    },
    {
      lessonId: '',
      groupName: 'Хичээлийн төлөвлөлт',
      groupType: 'PLAN',
      questionList: [
        {
          questionTitle:
            'Багш анхны хичээл дээр тухайн хичээлээс оюутны эзэмших мэдлэг, чадвар, хандлага; хичээлд хэрэглэх сургалтын арга хэлбэр; оюутныг хэрхэн дүгнэх арга, зарчим; ашиглах материал зэргийг хангалттай түвшинд тайлбарлаж өгсөн эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш хичээлийн явцад ашиглах үзүүлэн(PPT), лекц семинарын документ материал, лабораторийн заавар зэргийг суралцахуйн үр дүн, агуулгатай нь нийцүүлэн хангалттай түвшинд бэлтгэсэн эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш хичээлийн явцын шалгалтын материал, гэрийн даалгавар, бие даалтын ажлыг хангалттай түвшинд бэлтгэж, цаг хугацаанд оюутнуудад хүргэж чадсан эсэх/1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш цахим хичээлийн материалыг хангалттай түвшинд бэлтгэж, онлайн сургалтын системд цаг хугацаанд нь байршуулан сургалтыг чанартай зохион байгуулж чадсан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
      ],
    },
    {
      lessonId: '',
      groupName: 'Хичээлийн хэрэгжүүлэлт /заах арга зүй, шинэлэг тал/',
      groupType: 'METHOD',
      questionList: [
        {
          questionTitle:
            'Багш лекц, семинар, лабораторийн хичээл дээр асуудалд суурилсан, туршилтад суурилсан, тонгоруу анги гэх мэт сургалтын идэвхтэй аргуудыг хэр зэрэг түвшинд ашигласан вэ /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Хичээлийн явцад оюутнуудыг сургалтын үйл ажиллагаанд татан оролцуулах үр ашигтай аргуудыг (багаар ажиллуулах, асуудал шийдвэрлэх даалгавар хийлгэх, дүрд тоглуулах гэх мэт) хэр зэрэг түвшинд ашигласан вэ? /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш хичээлийг чин сэтгэлээсээ ойлгомжтой тайлбарлаж, оюутанд холбогдох мэдлэг, ур чадварыг бүрэн дүүрэн эзэмшүүлэхэд хичээж ажилласан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Хичээлийн явцад суралцагчдын дунд бодитой, амьд харилцаа бий болгон, таатай уур амьсгал бүрдүүлж оюутнуудыг идэвхжүүлэн, сонирхлыг татаж чадаж байсан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш хичээлийн явцад аудио, видео контент үзүүлэх; гар утасны апп болон бусад программ ашиглан тест, сорил авах; симуляци, загварчлалын программ ашиглах зэргээр мэдээлэл холбооны шинэлэг технологи, хэрэгслүүдийг хэр зэрэг ашигласан вэ? /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
      ],
    },
    {
      lessonId: '',
      groupName: 'Хичээлийн үнэлгээ',
      groupType: 'ASSESS',
      questionList: [
        {
          questionTitle:
            'Багш оюутнуудын хичээлээр эзэмшсэн мэдлэг, ур чадвар, хандлага төлөвшлийг шударгаар бодитой үнэлсэн эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш тухайн хичээлд тестийн шалгалтаас гадна хичээлийн төгсгөлд оюутны мэдлэгийг баталгаажуулах асуулт тавих; явцын сорил, улирлын шалгалт авахдаа асуултад хариулуулах, бодлого бодуулах, илтгэл тавиулах; мөн цахим тестийн систем хэрэглэх зэрэг үнэлгээний шинэлэг арга хэлбэрүүдийг ашигласан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш оюутны гүйцэтгэсэн даалгавар, бие даалтыг ажлыг дүгнэн ахиц дэвшлийн үнэлгээ хийж, эргэж оюутанд мэдээлдэг, алдаа дутагдлыг тайлбарладаг эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Багш оюутанд хичээлээс гадуур зөвлөгөө өгч, дэмжиж тусалж байсан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
      ],
    },
    {
      lessonId: '',
      groupName: 'Сургалтын орчин; Нөөцийн хүрэлцээ, хангамж',
      groupType: 'ENV',
      questionList: [
        {
          questionTitle:
            'Энэ хичээлтэй холбоотой ном, сурах бичиг, бусад материал хангалттай, хүртээмжтэй байсан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Лабораторийн хичээлд ашиглах компьютер/тоног төхөөрөмж хүрэлцээтэй, шаардлага хангаж байсан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
        {
          questionTitle:
            'Лекц/семинарын хичээлийн анги танхимын тохижилт, самбар, телевизор/прожектор, дэлгэц шаардлага хангаж байсан эсэх /1-5 оноо/',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
      ],
    },
  ];

  questionList: {
    text: string;
    questionType: string | Question;
    questionTypeName: string;
  }[] = [{ text: '', questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх' }];

  questions: QuestionList[] = [];
  id: any;

  constructor(
    private route: ActivatedRoute,
    private cloService: CLOService,
    private messageService: MessageService,
    private service: ProgressPollService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    if (this.lessonId) {
      this.refreshDetail();
    }
    this.mainData = {
      lessonId: this.lessonId,
      startDate: null,
      endDate: null,
      questions: [],
    };
    this.questionTypes = [
      { name: 'Үнэлгээ өгөх', code: 'RATE' },
      { name: 'Хариулт бичих', code: 'FEEDBACK' },
    ];
    this.dataQuestions = this.popQuestion;
    this.questions = this.popQuestion;

    this.popQuestion.forEach((question: any) => {
      question.questionList.forEach((answer: any) => {
        const matchedType = this.questionTypes?.find(
          (qt: any) => qt.code === answer.questionType
        );
        if (matchedType) {
          answer.questionType = matchedType; // 🔁 Replace string with full object
        }
      });
    });
    this.popQuestion;
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  onAnswerClick() {}
  onRemove(answerIndex: number, questionIndex: number) {
    const question = this.dataQuestions[questionIndex];

    // If only one question exists
    if (this.dataQuestions.length === 1) {
      if (question.questionList.length === 1) {
        // Remove the only question
        this.dataQuestions.splice(questionIndex, 1);
      } else {
        // Just remove the answer
        question.questionList.splice(answerIndex, 1);
      }
    } else {
      if (question.questionList.length === 1) {
        // Remove the entire question if it has only one answer
        this.dataQuestions.splice(questionIndex, 1);
      } else {
        // Just remove the answer
        question.questionList.splice(answerIndex, 1);
      }
    }
  }

  cloQuestion() {
    if (!this.createActive) {
      this.cloService.getCloList(this.lessonId).subscribe((e: any) => {
        let answerData: QueWithClo[] = [];
        e.map((cloData: any, index: any) => {
          const answer: QueWithClo = {
            questionTitle: cloData.cloName,
            cloId: cloData.id,
            questionType: 'RATE',
            questionTypeName: 'Үнэлгээ өгөх',
          };
          answerData.push(answer);
        });
        this.dataQuestions.push({
          lessonId: this.lessonId,
          groupName: 'Хичээлийн суралцахуйн үр дүнгийн үнэлгээ',
          groupType: 'CLO',
          questionList: answerData,
        });
      });
    }
  }

  // Хариултын текст өөрчлөгдөхөд
  onTextInput(answerIndex: number, questionIndex: number) {
    const changedAnswer =
      this.questions[questionIndex].questionList[answerIndex];
    console.log(
      `Question ${questionIndex}, Answer ${answerIndex}:`,
      changedAnswer
    );
  }

  addQuestion() {
    this.dataQuestions.push({
      lessonId: '',
      groupName: '',
      groupType: 'OTHER',
      questionList: [
        {
          questionTitle: '',
          questionType: 'RATE',
          questionTypeName: 'Үнэлгээ өгөх',
        },
      ],
    });
  }
  addAnswer(questionIndex: number) {
    this.dataQuestions[questionIndex].questionList.push({
      questionTitle: '',
      questionType: 'RATE',
      questionTypeName: 'Үнэлгээ өгөх',
    });
  }
  onQuestionType(e: any) {
    console.log('asdasd : ' + e.code);
  }
  refreshDetail() {
    this.service.getAllLessonAssments(this.lessonId).subscribe((e: any) => {
      console.log(e);
      if (e.length > 0) {
        e.map((i: any) => {
          //   this.progressPollId.push(i._id);
          this.dataQuestions = i.questions;
          i.questions.map((data1: any) => {
            data1.questionList.map((ans: any) => {
              this.questionTypes?.map((val: any) => {
                if (
                  ans.questionType !== undefined &&
                  ans.questionType !== null
                ) {
                  if (val.code === ans.questionType) {
                    ans.questionType = val;
                  }
                }
              });
            });
          });
          this.id = i._id;
          this.startDate = new Date(i.startDate);
          this.endDate = new Date(i.endDate);
        });
        this.createActive = true;
      }
      this.cloQuestion();
    });
  }
  save() {
    if (
      this.startDate !== undefined &&
      this.startDate !== null &&
      this.endDate !== undefined &&
      this.endDate !== null
    ) {
      if (this.endDate < this.startDate) {
        this.messageService.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Дуусах огноо эхлэх огнооноос хойш байна!: ',
        });
      } else {
        if (this.dataQuestions.length > 0) {
          this.dataQuestions.map((i: any, index: any) => {
            const id = this.progressPollId[index];
            i.lessonId = this.lessonId;
            i.questionList.map((answer: any) => {
              if (
                answer.questionType.code !== undefined &&
                answer.questionType.code !== null
              ) {
                answer.questionTypeName = answer.questionType.name;
                answer.questionType = answer.questionType.code;
              }
            });
          });

          this.mainData.questions = this.dataQuestions;
          this.mainData.startDate = this.startDate;
          this.mainData.endDate = this.endDate;
          if (!this.createActive) {
            this.service.createPollQuestions(this.mainData).subscribe(
              (e: any) => {
                this.progressPollId.push(e._id);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Амжилттай',
                  detail: `Санал асуулгыг амжилттай хадгаллаа!`,
                });
                this.refreshDetail();
              },
              (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Алдаа',
                  detail: 'Хадгалхад алдаа гарлаа!: ' + err.message,
                });
              }
            );
          } else {
            this.service.updatePollQuestions(this.id, this.mainData).subscribe(
              (e: any) => {
                this.refreshDetail();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Амжилттай',
                  detail: `Санал асуулгыг амжилттай хадгаллаа!`,
                });
              },
              (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Алдаа',
                  detail: 'Засхад алдаа гарлаа!: ' + err.message,
                });
              }
            );
          }
        }
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: 'Эхлэх болон дуусах огноог оруулна уу!',
      });
    }
  }
  onBranchChange(e: any) {
    console.log(e);
  }
}
