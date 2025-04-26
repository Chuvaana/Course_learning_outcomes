import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
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

interface Question {
  name: string;
  code: string;
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
  ],
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

  questionTypes: Question[] | undefined;

  checked: boolean = false;
  selectedCity: Question | undefined;
  dataQuestions: any;

  popQuestion = [
    {
      lessonId: '',
      groupName: 'Ерөнхий үр дүн, Багшийн ёс зүй',
      questionType: 'OTHER',
      questionList: [
        {
          questionTitle: 'Та энэ багшийг сонгон хичээл судалсандаа сэтгэл ханамжтай байгаа эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Та энэ хичээлийг сонгон судалснаар хангалттай түвшинд мэдлэг, ур чадвар, хандлага эзэмшиж чадсан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш хичээлээ цагт нь эхлүүлж дуусгах;  хичээлийн явцад цагийг үр дүнтэй ашиглах зэргээр цагийн менежмент хийж чадсан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш оюутантай хүндэтгэлтэй харилцах; тэдний санал хүсэлтийг хүлээн авах; үлгэрлэх зэргээр багшийн ёс зүйн хэм хэмжээг хангаж чадсан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ],
    },
    {
      lessonId: '',
      groupName: 'Хичээлийн төлөвлөлт',
      questionType: 'OTHER',
      questionList: [
        {
          questionTitle: 'Багш анхны хичээл дээр тухайн хичээлээс оюутны эзэмших мэдлэг, чадвар, хандлага; хичээлд хэрэглэх сургалтын арга хэлбэр; оюутныг хэрхэн дүгнэх арга, зарчим; ашиглах материал зэргийг хангалттай түвшинд тайлбарлаж өгсөн эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш хичээлийн явцад ашиглах үзүүлэн(PPT), лекц семинарын документ материал, лабораторийн заавар зэргийг суралцахуйн үр дүн, агуулгатай нь нийцүүлэн хангалттай түвшинд бэлтгэсэн эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш хичээлийн явцын шалгалтын материал, гэрийн даалгавар, бие даалтын ажлыг хангалттай түвшинд бэлтгэж, цаг хугацаанд оюутнуудад хүргэж чадсан эсэх/1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш цахим хичээлийн материалыг хангалттай түвшинд бэлтгэж, онлайн сургалтын системд цаг хугацаанд нь байршуулан сургалтыг чанартай зохион байгуулж чадсан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ],
    },
    {
      lessonId: '',
      groupName: 'Хичээлийн хэрэгжүүлэлт /заах арга зүй, шинэлэг тал/',
      questionType: 'OTHER',
      questionList: [
        {
          questionTitle: 'Багш лекц, семинар, лабораторийн хичээл дээр асуудалд суурилсан, туршилтад суурилсан, тонгоруу анги гэх мэт сургалтын идэвхтэй аргуудыг хэр зэрэг түвшинд ашигласан вэ /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Хичээлийн явцад оюутнуудыг сургалтын үйл ажиллагаанд татан оролцуулах үр ашигтай аргуудыг (багаар ажиллуулах, асуудал шийдвэрлэх даалгавар хийлгэх, дүрд тоглуулах гэх мэт) хэр зэрэг түвшинд ашигласан вэ? /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш хичээлийг чин сэтгэлээсээ ойлгомжтой тайлбарлаж, оюутанд холбогдох мэдлэг, ур чадварыг бүрэн дүүрэн эзэмшүүлэхэд хичээж ажилласан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Хичээлийн явцад суралцагчдын дунд бодитой, амьд харилцаа бий болгон, таатай уур амьсгал бүрдүүлж оюутнуудыг идэвхжүүлэн, сонирхлыг татаж чадаж байсан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш хичээлийн явцад аудио, видео контент үзүүлэх; гар утасны апп болон бусад программ ашиглан тест, сорил авах; симуляци, загварчлалын программ ашиглах зэргээр мэдээлэл холбооны шинэлэг технологи, хэрэгслүүдийг хэр зэрэг ашигласан вэ? /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ],
    },
    {
      lessonId: '',
      groupName: 'Хичээлийн үнэлгээ',
      questionType: 'OTHER',
      questionList: [
        {
          questionTitle: 'Багш оюутнуудын хичээлээр эзэмшсэн мэдлэг, ур чадвар, хандлага төлөвшлийг шударгаар бодитой үнэлсэн эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш тухайн хичээлд тестийн шалгалтаас гадна хичээлийн төгсгөлд оюутны мэдлэгийг баталгаажуулах асуулт тавих; явцын сорил, улирлын шалгалт авахдаа асуултад хариулуулах, бодлого бодуулах, илтгэл тавиулах; мөн цахим тестийн систем хэрэглэх зэрэг үнэлгээний шинэлэг арга хэлбэрүүдийг ашигласан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш оюутны гүйцэтгэсэн даалгавар, бие даалтыг ажлыг дүгнэн ахиц дэвшлийн үнэлгээ хийж, эргэж оюутанд мэдээлдэг, алдаа дутагдлыг тайлбарладаг эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Багш оюутанд хичээлээс гадуур зөвлөгөө өгч, дэмжиж тусалж байсан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ],
    },
    {
      lessonId: '',
      groupName: 'Сургалтын орчин; Нөөцийн хүрэлцээ, хангамж',
      questionType: 'OTHER',
      questionList: [
        {
          questionTitle: 'Энэ хичээлтэй холбоотой ном, сурах бичиг, бусад материал хангалттай, хүртээмжтэй байсан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'

        },
        {
          questionTitle: 'Лабораторийн хичээлд ашиглах компьютер/тоног төхөөрөмж хүрэлцээтэй, шаардлага хангаж байсан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          questionTitle: 'Лекц/семинарын хичээлийн анги танхимын тохижилт, самбар, телевизор/прожектор, дэлгэц шаардлага хангаж байсан эсэх /1-5 оноо/',
          answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ],
    },
  ];

  questionList: { text: string, answerValue: number, questionType: string | Question, questionTypeName: string }[] = [
    { text: '', answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх' }
  ];

  questions: {
    lessonId: string;
    questionType: string;
    groupName: string;
    questionList: { questionTitle: string, answerValue: number, questionType: string | Question, questionTypeName: string }[];
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private cloService: CLOService,
    private service: ProgressPollService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.lessonId = params.get('id')!;
    });
    if (this.lessonId) {
      this.refreshDetail();
    }
    this.questionTypes = [
      { name: 'Үнэлгээ өгөх', code: 'RATE' },
      { name: 'Хариулт бичих', code: 'FEEDBACK' },
    ];
    this.dataQuestions = this.popQuestion;
    this.questions = this.popQuestion;

    this.popQuestion.forEach((question: any) => {
      question.questionList.forEach((answer: any) => {
        const matchedType = this.questionTypes?.find((qt: any) => qt.code === answer.questionType);
        if (matchedType) {
          answer.questionType = matchedType; // 🔁 Replace string with full object
        }
      });
    });
    this.popQuestion;
    this.cloQuestion();
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
        console.log('CLO = ', e);
        let countPoint = 5;
        let answerData: { totalPoint: number; point: number; answerValue: number; questionTitle: string; questionType: string | Question; questionTypeName: string; }[] = [];
        e.map((cloData: any, index: any) => {
          const answer: {
            totalPoint: number;
            point: number;
            answerValue: number;
            questionTitle: string;
            questionType: string | Question;
            questionTypeName: string;
          } = {
            totalPoint: 0,
            point: 0,
            answerValue: 0,
            questionTitle: cloData.cloName,
            questionType: 'RATE',
            questionTypeName: 'Үнэлгээ өгөх',
          };
          countPoint = countPoint + 5;
          const matchedType = this.questionTypes?.find(
            (val: any) => val.code === answer.questionType
          );
          if (matchedType) {
            answer.questionType = matchedType; // ✅ Assign full object here
          }

          answerData.push(answer);
        });
        this.dataQuestions.push({
          lessonId: this.lessonId,
          groupName: 'Хичээлийн суралцахуйн үр дүнгийн үнэлгээ',
          questionType: 'Хичээлийн суралцахуйн үр дүнгийн үнэлгээ',
          questionList: answerData
        });
      });
    }
  }

  // Хариултын текст өөрчлөгдөхөд
  onTextInput(answerIndex: number, questionIndex: number) {
    const changedAnswer = this.questions[questionIndex].questionList[answerIndex];
    console.log(`Question ${questionIndex}, Answer ${answerIndex}:`, changedAnswer);
  }

  addQuestion() {
    this.dataQuestions.push({
      lessonId: '',
      groupName: '',
      questionType: '',
      questionList: [
        { answerName: '', answerId: 1, answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх' }
      ]
    });
  }
  addAnswer(questionIndex: number) {
    this.dataQuestions[questionIndex].answers.push({ answerName: '', answerId: 1, answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх' });
  }
  onQuestionType(e: any) {
    console.log('asdasd : ' + e.code);
  }
  refreshDetail() {
    this.service.getAllLessonAssments(this.lessonId).subscribe((e: any) => {
      console.log(e);
      if (e.length > 0) {
        e.map((i: any) => {
          this.progressPollId.push(i._id);
          i.questionList.map((ans: any) => {
            this.questionTypes?.map((val: any) => {
              if (ans.questionType !== undefined && ans.questionType !== null) {
                if (val.code === ans.questionType) {
                  ans.questionType = val;
                }
              }
            });
          });
        });
        // this.dataQuestions = e;
        this.createActive = true;
      }
    });
  }
  save() {
    if (this.dataQuestions.length > 0) {
      this.dataQuestions.map((i: any, index: any) => {
        const id = this.progressPollId[index];
        i.lessonId = this.lessonId;
        i.questionList.map((answer: any) => {
          if (answer.questionType.code !== undefined && answer.questionType.code !== null) {
            answer.questionTypeName = answer.questionType.name;
            answer.questionType = answer.questionType.code;
          }
        });
        if (!this.createActive) {
          this.service.createPollQuestions(i).subscribe((e: any) => {
            this.progressPollId.push(e._id);
            this.refreshDetail();
          });
        } else {
          this.service.updatePollQuestions(id, i).subscribe((e: any) => {
            this.refreshDetail();
          });
        }
      });
    }
  }
  onBranchChange(e: any) {
    console.log(e);
  }
}
