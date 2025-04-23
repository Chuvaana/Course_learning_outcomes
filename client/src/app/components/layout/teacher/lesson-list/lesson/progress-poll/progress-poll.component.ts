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
  imports: [ReactiveFormsModule, FloatLabelModule, ButtonModule, CommonModule, TextareaModule, CheckboxModule, DropdownModule, InputTextModule, IftaLabelModule, RouterModule, TieredMenuModule, ToastModule, FormsModule],
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
      value: '1',
      lessonId: '',
      studentId: '',
      pollQuestionId: '1',
      questionSubName: 'Ерөнхий үр дүн, Багшийн ёс зүй',
      questionName: 'Ерөнхий үр дүн, Багшийн ёс зүй',
      questionType: 'rating',
      questionTypeName: 'Оноогоор үнэлэх',
      totalPoint: 5,
      dateOfReplyTime: '',
      answers: [
        {
          answerName: 'Та энэ багшийг сонгон хичээл судалсандаа сэтгэл ханамжтай байгаа эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 1, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Та энэ хичээлийг сонгон судалснаар хангалттай түвшинд мэдлэг, ур чадвар, хандлага эзэмшиж чадсан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 2, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш хичээлээ цагт нь эхлүүлж дуусгах;  хичээлийн явцад цагийг үр дүнтэй ашиглах зэргээр цагийн менежмент хийж чадсан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 3, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш оюутантай хүндэтгэлтэй харилцах; тэдний санал хүсэлтийг хүлээн авах; үлгэрлэх зэргээр багшийн ёс зүйн хэм хэмжээг хангаж чадсан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 4, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ]
    },
    {
      value: '2',
      lessonId: '',
      studentId: '',
      pollQuestionId: '2',
      questionSubName: 'Хичээлийн төлөвлөлт',
      questionName: 'Хичээлийн төлөвлөлт',
      questionType: 'rating',
      questionTypeName: 'Оноогоор үнэлэх',
      totalPoint: 5,
      dateOfReplyTime: '',
      answers: [
        {
          answerName: 'Багш анхны хичээл дээр тухайн хичээлээс оюутны эзэмших мэдлэг, чадвар, хандлага; хичээлд хэрэглэх сургалтын арга хэлбэр; оюутныг хэрхэн дүгнэх арга, зарчим; ашиглах материал зэргийг хангалттай түвшинд тайлбарлаж өгсөн эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 1, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш хичээлийн явцад ашиглах үзүүлэн(PPT), лекц семинарын документ материал, лабораторийн заавар зэргийг суралцахуйн үр дүн, агуулгатай нь нийцүүлэн хангалттай түвшинд бэлтгэсэн эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 2, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш хичээлийн явцын шалгалтын материал, гэрийн даалгавар, бие даалтын ажлыг хангалттай түвшинд бэлтгэж, цаг хугацаанд оюутнуудад хүргэж чадсан эсэх/1-5 оноо/',
          answerValue: 0,
          answerId: 3, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш цахим хичээлийн материалыг хангалттай түвшинд бэлтгэж, онлайн сургалтын системд цаг хугацаанд нь байршуулан сургалтыг чанартай зохион байгуулж чадсан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 4, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ]
    },
    {
      value: '3',
      lessonId: '',
      studentId: '',
      pollQuestionId: '3',
      questionSubName: 'Хичээлийн хэрэгжүүлэлт /заах арга зүй, шинэлэг тал/',
      questionName: 'Хичээлийн хэрэгжүүлэлт /заах арга зүй, шинэлэг тал/',
      questionType: 'rating',
      questionTypeName: 'Оноогоор үнэлэх',
      totalPoint: 5,
      dateOfReplyTime: '',
      answers: [
        {
          answerName: 'Багш лекц, семинар, лабораторийн хичээл дээр асуудалд суурилсан, туршилтад суурилсан, тонгоруу анги гэх мэт сургалтын идэвхтэй аргуудыг хэр зэрэг түвшинд ашигласан вэ /1-5 оноо/',
          answerValue: 2,
          answerId: 1, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Хичээлийн явцад оюутнуудыг сургалтын үйл ажиллагаанд татан оролцуулах үр ашигтай аргуудыг (багаар ажиллуулах, асуудал шийдвэрлэх даалгавар хийлгэх, дүрд тоглуулах гэх мэт) хэр зэрэг түвшинд ашигласан вэ? /1-5 оноо/',
          answerValue: 0,
          answerId: 2, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш хичээлийг чин сэтгэлээсээ ойлгомжтой тайлбарлаж, оюутанд холбогдох мэдлэг, ур чадварыг бүрэн дүүрэн эзэмшүүлэхэд хичээж ажилласан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 3, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Хичээлийн явцад суралцагчдын дунд бодитой, амьд харилцаа бий болгон, таатай уур амьсгал бүрдүүлж оюутнуудыг идэвхжүүлэн, сонирхлыг татаж чадаж байсан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 4, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш хичээлийн явцад аудио, видео контент үзүүлэх; гар утасны апп болон бусад программ ашиглан тест, сорил авах; симуляци, загварчлалын программ ашиглах зэргээр мэдээлэл холбооны шинэлэг технологи, хэрэгслүүдийг хэр зэрэг ашигласан вэ? /1-5 оноо/',
          answerValue: 0,
          answerId: 5, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ]
    },
    {
      value: '5',
      lessonId: '',
      studentId: '',
      pollQuestionId: '5',
      questionSubName: 'Хичээлийн үнэлгээ',
      questionName: 'Хичээлийн үнэлгээ',
      questionType: 'rating',
      questionTypeName: 'Оноогоор үнэлэх',
      totalPoint: 5,
      dateOfReplyTime: '',
      answers: [
        {
          answerName: 'Багш оюутнуудын хичээлээр эзэмшсэн мэдлэг, ур чадвар, хандлага төлөвшлийг шударгаар бодитой үнэлсэн эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 1, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш тухайн хичээлд тестийн шалгалтаас гадна хичээлийн төгсгөлд оюутны мэдлэгийг баталгаажуулах асуулт тавих; явцын сорил, улирлын шалгалт авахдаа асуултад хариулуулах, бодлого бодуулах, илтгэл тавиулах; мөн цахим тестийн систем хэрэглэх зэрэг үнэлгээний шинэлэг арга хэлбэрүүдийг ашигласан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 2, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш оюутны гүйцэтгэсэн даалгавар, бие даалтыг ажлыг дүгнэн ахиц дэвшлийн үнэлгээ хийж, эргэж оюутанд мэдээлдэг, алдаа дутагдлыг тайлбарладаг эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 3, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Багш оюутанд хичээлээс гадуур зөвлөгөө өгч, дэмжиж тусалж байсан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 4, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ]
    },
    {
      value: '6',
      lessonId: '',
      studentId: '',
      pollQuestionId: '6',
      questionSubName: 'Сургалтын орчин; Нөөцийн хүрэлцээ, хангамж',
      questionName: 'Сургалтын орчин; Нөөцийн хүрэлцээ, хангамж',
      questionType: 'rating',
      questionTypeName: 'Оноогоор үнэлэх',
      totalPoint: 5,
      dateOfReplyTime: '',
      answers: [
        {
          answerName: 'Энэ хичээлтэй холбоотой ном, сурах бичиг, бусад материал хангалттай, хүртээмжтэй байсан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 1, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'

        },
        {
          answerName: 'Лабораторийн хичээлд ашиглах компьютер/тоног төхөөрөмж хүрэлцээтэй, шаардлага хангаж байсан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 2, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
        {
          answerName: 'Лекц/семинарын хичээлийн анги танхимын тохижилт, самбар, телевизор/прожектор, дэлгэц шаардлага хангаж байсан эсэх /1-5 оноо/',
          answerValue: 0,
          answerId: 3, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх'
        },
      ]
    },
  ];

  answers: { text: string; answerId: number, answerValue: number, questionType: string | Question, questionTypeName: string }[] = [
    { text: '', answerId: 0, answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх' }
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
    answers: { answerName: string; answerId: number, answerValue: number, questionType: string | Question, questionTypeName: string }[];
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private cloService: CLOService,
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
    this.dataQuestions = this.popQuestion;
    this.questions = this.popQuestion;

    this.popQuestion.forEach((question: any) => {
      question.answers.forEach((answer: any) => {
        const matchedType = this.questionTypes?.find((qt: any) => qt.code === answer.questionType);
        if (matchedType) {
          answer.questionType = matchedType; // 🔁 Replace string with full object
        }
      });
    });
    this.popQuestion
    this.cloQuestion();
    this.addQuestion();
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

  cloQuestion() {
    if (!this.createActive) {

      this.cloService.getCloPlan(this.lessonId).subscribe((e: any) => {
        console.log('CLO = ', e);
        let countPoint = 5;
        let answerData: { answerName: string; answerId: number; answerValue: number; questionType: string | Question; questionTypeName: string; }[] = [];
        answerData.push({ answerName: 'Оюутан та энэ хичээлээр эзэмшсэн мэдлэг, чадвар, хандлагын түвшингээ тодорхойлно уу', answerId: 0, answerValue: 0, questionType: { code: "RATE", name: "Үнэлгээ өгөх" }, questionTypeName: 'Үнэлгээ өгөх' });
        e.map((cloData: any, index: any) => {
          const answer: {
            answerName: string;
            answerId: number;
            answerValue: number;
            questionType: string | Question;
            questionTypeName: string;
          } = {
            answerName: cloData.cloName + ' тус түвшингээ тодорхойлно уу',
            answerId: index + 1,
            answerValue: 0,
            questionType: 'RATE',
            questionTypeName: 'Үнэлгээ өгөх',
          };
          countPoint = countPoint + 5;
          const matchedType = this.questionTypes?.find((val: any) => val.code === answer.questionType);
          if (matchedType) {
            answer.questionType = matchedType; // ✅ Assign full object here
          }

          answerData.push(answer);
        });
        this.dataQuestions.push({
          value: '',
          lessonId: this.lessonId,
          studentId: this.lessonId,
          pollQuestionId: '1',
          questionSubName: 'Хичээлийн суралцахуйн үр дүнгийн үнэлгээ',
          questionName: 'Хичээлийн суралцахуйн үр дүнгийн үнэлгээ',
          totalPoint: countPoint,
          dateOfReplyTime: '2024-12-12',
          answers: answerData
        });
      });
    }
  }

  // Хариултын текст өөрчлөгдөхөд
  onTextInput(answerIndex: number, questionIndex: number) {
    const changedAnswer = this.questions[questionIndex].answers[answerIndex];
    console.log(`Question ${questionIndex}, Answer ${answerIndex}:`, changedAnswer);
  }

  addQuestion() {
    this.dataQuestions.push({
      value: '',
      lessonId: '',
      studentId: '',
      pollQuestionId: '',
      questionSubName: '',
      questionName: '',
      questionType: '',
      questionTypeName: '',
      totalPoint: '',
      dateOfReplyTime: '',
      answers: [
        { answerName: '', answerId: 1, answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх' }
      ]
    });
  }
  addAnswer(questionIndex: number) {
    this.dataQuestions[questionIndex].answers.push({ answerName: '', answerId: 1, answerValue: 0, questionType: 'RATE', questionTypeName: 'Үнэлгээ өгөх' });
  }
  onQuestionType(e: any) {
    console.log("asdasd : " + e.code);
  }
  refreshDetail() {
    this.service.getAllLessonAssments(this.lessonId).subscribe((e: any) => {

      console.log(e);
      if (e.length > 0) {
        e.map((i: any) => {
          this.progressPollId.push(i._id);
          i.answers.map((ans: any) => {
            this.questionTypes?.map((val: any) => {
              if (ans.questionType !== undefined && ans.questionType !== null) {
                if (val.code === ans.questionType) {
                  ans.questionType = val;
                }
              }
            });
          })
        });
        this.dataQuestions = e;
        this.createActive = true;
      }
    });
  }
  save() {
    if (this.dataQuestions.length > 0) {
      this.dataQuestions.map((i: any, index: any) => {
        const id = this.progressPollId[index];
        i.lessonId = '67f21da15d1c9f9efbf37dd9';
        i.studentId = '67f21da15d1c9f9efbf37dd9';
        i.dateOfReplyTime = '2024-12-12';
        i.answers.map((answer: any) => {
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
